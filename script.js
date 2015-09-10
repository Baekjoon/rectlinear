'use strict';
function SelectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;    
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

$(function() {
    var tbody = $('table#lattice-table tbody');
    var n = 70;
    var m = 100;
    for (var i=0; i<n; i++) {
        var tr = $('<tr></tr>');
        tbody.append(tr);
        for (var j=0; j<m; j++) {
            var td = $('<td>&nbsp;</td>');
            td.attr('data-row',i);
            td.attr('data-col',j);
            td.addClass('cell-'+i+'-'+j);
            tr.append(td);
        }
    }
    var x = parseInt(n/2);
    var y = parseInt(m/2);
    var sx = x;
    var sy = y;
    var q = []
    var makecell = function(x, y) {
        return '.cell-'+x+'-'+y;
    }
    var changedir = function(x,y) {
        var c = $(makecell(x,y));
        c.addClass('change-dir');
        //$('#result').append(x + ' ' + y+'\n');
        q.push([x,y]);
    }
    var done = function() {
        var r = $('#result');
        r.append(q.length+'\n');
        q.forEach(function(e) {
            r.append(e[0] + ' ' + e[1] + '\n');
        });
        r.append('\n');
        SelectText('result');
    }
    var visit = function(x,y) {
        s[makecell(x,y)] = true;
        var c = $(makecell(x,y));
        c.addClass('selected');
        if (x == sx && y == sy) {
            alert('Done!');
            done();
        }
    }
    var c = $(makecell(x,y));
    c.addClass('selected');
    changedir(x,y);
    c.addClass('start');
    var dir = -1;
    var s = {};
//    s[makecell(x,y)] = true;
    key('right', function() {
        if (y+1 < m && !s[makecell(x,y+1)]) {
            if (dir != -1 && dir != 0) {
                changedir(x,y);
            }
            y += 1;
        }
        visit(x,y);
        dir = 0;
    });
    key('down', function() {
        if (x+1 < n && !s[makecell(x+1,y)]) {
            if (dir != -1 && dir != 1) {
                changedir(x,y);
            }
            x += 1;
        }
        visit(x,y);
        dir = 1;
    });
    key('left', function() {
        if (y-1 >= 0 && !s[makecell(x,y-1)]) {
            if (dir != -1 && dir != 2) {
                changedir(x,y);
            }
            y -= 1;
        }
        visit(x,y);
        dir = 2;
    });
    key('up', function() {
        if (x-1 >= 0 && !s[makecell(x-1,y)]) {
            if (dir != -1 && dir != 3) {
                changedir(x,y);
            }
            x -= 1;
        }
        visit(x,y);
        dir = 3;
    });
});