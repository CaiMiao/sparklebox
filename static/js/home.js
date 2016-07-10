function load_completion_list_and_call(func) {
    var xhr = new XMLHttpRequest()
    xhr.open("GET", "/suggest", true)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            window.name_completion_list = JSON.parse(xhr.responseText)
            func()
        }
    }
    xhr.send()
}

function fuzzyfinder(string, names) {
    suggestions = []
    pattern = string.split("").join('.*?')
    regex = new RegExp(pattern)

    for (var i = 0; i < names.length; i++) {
        var match = regex.exec(names[i])

        if (match !== null) {
            var len = match[0].length
            var loc = match.index

            suggestions.push([len, loc, names[i]])
        }
    }

    suggestions.sort(function(a, b) {
        return a[0] - b[0];
    });
    return suggestions
}

function suggest(that, text) {
    if (!text) {
        document.getElementById("suggestions").innerHTML = ""
        return
    }

    if (window.name_completion_list === undefined) {
        load_completion_list_and_call(function() { suggest(that, that.value) })
        return
    }

    var found = fuzzyfinder(text, Object.keys(window.name_completion_list))
    document.getElementById("suggestions").innerHTML = ""
    console.log(found)

    chara_ids = []
    found_i = []
    for (var i = 0; i < found.length; i++) {
        var now_id = window.name_completion_list [found [i] [2]] [1]// getting actual chara_id for results
        var k = chara_ids.indexOf(now_id)
        if (k == -1) {
            chara_ids.push(now_id)// existed chara_id would be ignored at the array
            found_i.push([found[i][0], found[i][1], found[i][2]])// first "found" array of result would be logged
        }
    }

    for (var i = 0; i < chara_ids.length; i++) {
        var n = document.createElement("a");

        put = "<span class='highlight'>"
        aname = window.name_completion_list[chara_ids[i]][0]// found[i][2] is replaced with actual ID (chara_ids[i]), but all result would applying "key" keyword appearance
        s1 = aname.slice(0, found_i[i][1])
        s2 = aname.slice(found_i[i][1], found_i[i][1] + found_i[i][0])
        s3 = aname.slice(found_i[i][1] + found_i[i][0])
        
        n.innerHTML = s1 + put + s2 + "</span>" + s3
        n.href = "/char/" + chara_ids[i][0]
        document.getElementById("suggestions").appendChild(n)
    }
}

// https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
function pad_digits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

function ec_count(that) {
    var d = new Date()
    var msLeft = (parseFloat(that.getAttribute("data-count-to")) * 1000) - d.getTime()
    var seconds = msLeft / 1000
    var secondsOnly = seconds % 60
    var minutes = (seconds - secondsOnly) / 60
    var minutesOnly = minutes % 60
    var hours = (minutes - minutesOnly) / 60
    var hoursOnly = hours % 24
    var days = (hours - hoursOnly) / 24

    var s = pad_digits(hoursOnly, 2) + ":" + pad_digits(minutesOnly, 2) + ":" + pad_digits(secondsOnly | 0, 2)
    if (days) {
        s = days + (days == 1? " day, " : " days, ") + s
    }
    that.textContent = s
}

function event_counter_init() {
    if (document.getElementById("event_counter_container"))
        document.getElementById("event_counter_container").style.display = "block"
    var ec = document.querySelectorAll(".counter");
    if (ec.length) {
        setInterval(function() {
            for (var i = 0; i < ec.length; i++) {
                ec_count(ec[i]);
            }
        }, 500);
    }
}