/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

(function (window) {

    'use strict';

    // class helper functions from bonzo https://github.com/ded/bonzo

    function classReg(className) {
        return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
    }

    // classList support for class management
    // altho to be fair, the api sucks because it won't accept multiple classes at once
    var hasClass, addClass, removeClass;

    if ('classList' in document.documentElement) {
        hasClass = function (elem, c) {
            return elem.classList.contains(c);
        };
        addClass = function (elem, c) {
            elem.classList.add(c);
        };
        removeClass = function (elem, c) {
            elem.classList.remove(c);
        };
    }
    else {
        hasClass = function (elem, c) {
            return classReg(c).test(elem.className);
        };
        addClass = function (elem, c) {
            if (!hasClass(elem, c)) {
                elem.className = elem.className + ' ' + c;
            }
        };
        removeClass = function (elem, c) {
            elem.className = elem.className.replace(classReg(c), ' ');
        };
    }

    function toggleClass(elem, c) {
        var fn = hasClass(elem, c) ? removeClass : addClass;
        fn(elem, c);
    }

    var classie = {
        // full names
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        // short names
        has: hasClass,
        add: addClass,
        remove: removeClass,
        toggle: toggleClass
    };

    // transport
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(classie);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = classie;
    } else {
        // browser global
        window.classie = classie;
    }

})(window);

//  Get the documentElement (<html>) to display the page in fullscreen 
var elem = document.documentElement;
function toggleFullscreen() {
    if ((window.fullScreen) ||
        (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
            closeFullscreen()
    } else {
        openFullscreen()
    }
}
/* View in fullscreen */
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen() {
    if (elem.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}


// while dragging we store and detect the nearest card in the dropzone where
// where the dragged card is being dropped which is stored as global variable as 
// it is required across different stages of Drag and Drop
var nearest
var oldNearest

// function is triggered when drag is over (or stopped)
// lane drop validity can be checked here (if req)
// just before drop the nearest card in the drop zone is fetched and a visual gap
// is added by extending margin. It looks like the lane is making space for 
// the card being dropped
function allowDrop(ev) {
    ev.preventDefault();
    // nearest can be null if card dropped in the empty space between 2 cards
    // so we are only setting oldNearest to the last nearest card 
    if (nearest != null) {
        oldNearest = nearest   
    }
    //fetching the latest nearest card
    nearest = ev.target.closest(".card")
    // for first case: when board is loaded again oldNearest will be null
    if (oldNearest == null && nearest != null) {
        nearest.classList.add("gap")
    }
    // switch the gap to a new nearest card 
    if (nearest != oldNearest && nearest != null) {
        oldNearest.classList.remove("gap")
        nearest.classList.add("gap")
    }
}

// triggered when drag starts
function drag(ev) {
    var element = ev.target
    setTimeout(function () {
        element.classList.add('hide-card');
    });
    ev.dataTransfer.setData("text", ev.target.id);
}

// triggered when card drag ends
function dragOver(ev) {
    var element = ev.srcElement
    element.classList.remove('hide-card');
    ele = document.getElementsByClassName("gap")
    if(ele.length != 0){
        ele[0].classList.remove("gap")
    }
}

// triggered on drop over card container
// get the data being dragged (card id) and based on user intent place the card 
function drop(ev) {
    ev.preventDefault();
    let data = document.getElementById(ev.dataTransfer.getData("text"));
    let nearestCard = ev.target.closest('.card');
    let parent = ev.target.closest('.card-container')
    if (nearestCard == null) {
        // if user places in the gap (nearestCard == null), 
        // get the last nearest card and place above it
        if (parent.getElementsByClassName("card").length != 0 ) {
            oldNearest.parentNode.insertBefore(data, oldNearest)   
        } else{
            // if no card in the lane then append the card to lane
            parent.append(data)
        }
    } else {
        // if dropped directly over a card, then place the new card just above it
        nearestCard.parentNode.insertBefore(data, nearestCard)   
    }
    moveCardLane(ev)
    oldNearest = null;
    nearest = null;
}

function renderPage(params) {
    (function (window) {

        'use strict';

        var support = { transitions: Modernizr.csstransitions },
            // transition end event name
            transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
            transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
            onEndTransition = function (el, callback) {
                var onEndCallbackFn = function (ev) {
                    if (support.transitions) {
                        if (ev.target != this) return;
                        this.removeEventListener(transEndEventName, onEndCallbackFn);
                    }
                    if (callback && typeof callback === 'function') { callback.call(this); }
                };
                if (support.transitions) {
                    el.addEventListener(transEndEventName, onEndCallbackFn);
                }
                else {
                    onEndCallbackFn();
                }
            },
            // the pages wrapper
            stack = document.querySelector('.pages-stack'),
            // the page elements
            pages = [].slice.call(stack.children),
            // total number of page elements
            pagesTotal = pages.length,
            // index of current page
            current = 0,
            // menu button
            menuCtrl = document.querySelector('button.menu-button'),
            // the navigation wrapper
            nav = document.querySelector('.pages-nav'),
            // the menu nav items
            navItems = [].slice.call(nav.querySelectorAll('.link--page')),
            // check if menu is open
            isMenuOpen = false;

        function init() {
            buildStack();
            initEvents();
        }

        function buildStack() {
            var stackPagesIdxs = getStackPagesIdxs();

            // set z-index, opacity, initial transforms to pages and add class page--inactive to all except the current one
            for (var i = 0; i < pagesTotal; ++i) {
                var page = pages[i],
                    posIdx = stackPagesIdxs.indexOf(i);

                if (current !== i) {
                    classie.add(page, 'page--inactive');

                    if (posIdx !== -1) {
                        // visible pages in the stack
                        page.style.WebkitTransform = 'translate3d(0,100%,0)';
                        page.style.transform = 'translate3d(0,100%,0)';
                    }
                    else {
                        // invisible pages in the stack
                        page.style.WebkitTransform = 'translate3d(0,75%,-300px)';
                        page.style.transform = 'translate3d(0,75%,-300px)';
                    }
                }
                else {
                    classie.remove(page, 'page--inactive');
                }

                page.style.zIndex = i < current ? parseInt(current - i) : parseInt(pagesTotal + current - i);

                if (posIdx !== -1) {
                    page.style.opacity = parseFloat(1 - 0.1 * posIdx);
                }
                else {
                    page.style.opacity = 0;
                }
            }
        }

        // event binding
        function initEvents() {
            // menu button click
            menuCtrl.addEventListener('click', toggleMenu);

            // navigation menu clicks
            navItems.forEach(function (item) {
                // which page to open?
                var pageid = item.getAttribute('href').slice(1);
                item.addEventListener('click', function (ev) {
                    ev.preventDefault();
                    openPage(pageid);
                });
            });

            // clicking on a page when the menu is open triggers the menu to close again and open the clicked page
            pages.forEach(function (page) {
                var pageid = page.getAttribute('id');
                page.addEventListener('click', function (ev) {
                    if (isMenuOpen) {
                        ev.preventDefault();
                        openPage(pageid);
                    }
                });
            });

            // keyboard navigation events
            document.addEventListener('keydown', function (ev) {
                if (!isMenuOpen) return;
                var keyCode = ev.keyCode || ev.which;
                if (keyCode === 27) {
                    closeMenu();
                }
            });
        }

        // toggle menu fn
        function toggleMenu() {
            if (isMenuOpen) {
                closeMenu();
            }
            else {
                openMenu();
                isMenuOpen = true;
            }
        }

        // opens the menu
        function openMenu() {
            // toggle the menu button
            classie.add(menuCtrl, 'menu-button--open')
            // stack gets the class "pages-stack--open" to add the transitions
            classie.add(stack, 'pages-stack--open');
            // reveal the menu
            classie.add(nav, 'pages-nav--open');

            // now set the page transforms
            var stackPagesIdxs = getStackPagesIdxs();
            for (var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
                var page = pages[stackPagesIdxs[i]];
                page.style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50 * i) + 'px)'; // -200px, -230px, -260px
                page.style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50 * i) + 'px)';

            }
            $("header").slideUp("fast")
        }

        // closes the menu
        function closeMenu() {
            // same as opening the current page again
            openPage();
            $("header").delay(300).slideDown("fast")
        }

        // opens a page
        function openPage(id) {
            var futurePage = id ? document.getElementById(id) : pages[current],
                futureCurrent = pages.indexOf(futurePage),
                stackPagesIdxs = getStackPagesIdxs(futureCurrent);

            // set transforms for the new current page
            futurePage.style.WebkitTransform = 'translate3d(0, 0, 0)';
            futurePage.style.transform = 'translate3d(0, 0, 0)';
            futurePage.style.opacity = 1;

            // set transforms for the other items in the stack
            for (var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
                var page = pages[stackPagesIdxs[i]];
                page.style.WebkitTransform = 'translate3d(0,100%,0)';
                page.style.transform = 'translate3d(0,100%,0)';
            }

            // set current
            if (id) {
                current = futureCurrent;
            }

            // close menu..
            classie.remove(menuCtrl, 'menu-button--open');
            classie.remove(nav, 'pages-nav--open');
            onEndTransition(futurePage, function () {
                classie.remove(stack, 'pages-stack--open');
                // reorganize stack
                buildStack();
                isMenuOpen = false;
            });
            $("header").delay(300).slideDown("fast")
        }

        // gets the current stack pages indexes. If any of them is the excludePage then this one is not part of the returned array
        function getStackPagesIdxs(excludePageIdx) {
            var nextStackPageIdx = current + 1 < pagesTotal ? current + 1 : 0,
                nextStackPageIdx_2 = current + 2 < pagesTotal ? current + 2 : 1,
                idxs = [],

                excludeIdx = excludePageIdx || -1;

            if (excludePageIdx != current) {
                idxs.push(current);
            }
            if (excludePageIdx != nextStackPageIdx) {
                idxs.push(nextStackPageIdx);
            }
            if (excludePageIdx != nextStackPageIdx_2) {
                idxs.push(nextStackPageIdx_2);
            }

            return idxs;
        }

        init();

    })(window); 
} 

var lanes = []
function getBoards() {
    $.ajax({
        url: '/api/board',
        method: 'GET',
        contentType: 'application/json',
        success: function(data) {
            template = $('#page').html()
            html = ejs.render(template, {'boards': data})
            $('.pages-stack').append(html)
            boards = document.getElementsByClassName("page");            
            template = $('#pageNav').html()
            html = ejs.render(template, { 'boards': data })
            
            $('.pages-nav').append(html)
            // stack navigation 
            renderPage()
            laneContainers = document.getElementsByClassName("lane-container")
            for(item of laneContainers){
                $(item).width(parseInt($(item).data("lanes"))*400)
            }
            lanes = document.getElementsByClassName("lane");
            renderCards()
        }
    })
}


function getCards(laneId) {
    $.ajax({
        url: '/api/card',
        method: 'GET',
        data: {
            laneId: laneId
        },
        contentType: 'application/json',
        success: function (data) {
            ejsCardRender(data, laneId)
        }
    })
}

function renderCards() {
    for(lane of lanes){
        getCards(lane.id)
    }
}

function ejsCardRender(data, laneId) {
    template = $('#card').html()
    html = ejs.render(template, { 'cards': data })
    container = "#" + String(laneId) + "  .card-container"
    $(container).append(html)
}

function ejsLaneRender(data, boardId) {
    template = $('#lane').html()
    html = ejs.render(template, { 'lanes': data })
    $('#'+boardId).find('.lane-container').append(html)
}

function addCardToLane(laneID, btn) {
    if ($(".card.new").length == 0) {
        template = $('#newcard').html()
        html = ejs.render(template)
        container = "#" + String(laneID) + "  .card-container"
        $(container).stop().animate({
            scrollTop: $(container)[0].scrollHeight
        }, 500);
        $(container).append(html)
        $("#card-title-edit").focus()
        $(btn).text("Done")
    }else{
        // TODO handle the case where a new card already exists on the board
        if ($(btn).text() == "Done") {
            saveCards()
        }else{
            $('.add-card-btn').html('Add card')
            var card = $(".card.new")
            $(".card.new").remove()
            container = "#" + String(laneID) + "  .card-container"
            $(container).stop().animate({
                scrollTop: $(container)[0].scrollHeight
            }, 500);
            $(container).append(card)
            $("#card-title-edit").focus()
            $(btn).text("Done")
        }
    }
}

function saveCards() {
    let title = $("#card-title-edit").val()
    let lane_id = $($("#card-title-edit").parents('.lane')).attr('id')
    $.ajax({
        url: '/api/card/create',
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({ "title": title, lane_id: lane_id }),
        success: function (data) {
            ejsCardRender([data], lane_id)
            $('.card.new').remove()
            $('.add-card-btn').html('Add card')
        },
        error: function (data) {
            alert("Unable to add card")
        }
    })
}

function inputSubmit(ev) {
    if (ev.keyCode == 13) {
        saveCards()
    }
}

function addNewLane(boardID) {
    if( $("#new-lane").length == 0 ){
        let template = $("#newLane").html()
        let html = ejs.render(template)
        container = "#" + String(boardID) +" .lane-container"
        $(container).append(html)
        $(container).width($(container).width() + 400)
        $("#lane-name-edit").focus()
    } else {
        console.log("an empty lane still exists")
    }
    
}

function newLaneSubmit(e) {
    if (e.keyCode == 13) {
        let title = $("#lane-name-edit").val()
        let board_id = $($("#lane-name-edit").parents('.page')).attr('id')
        $.ajax({
            url: '/api/lane/create',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({"title": title, board_id: board_id}),
            success: function(data) {
                ejsLaneRender([data], board_id)
                $('#new-lane').remove()
            },
            error: function(data) {
                alert("Unable to add card")
            }
        })
        // then re render just one card in the lane it was added to
        // remove the add card new div from the dom
    }
}

function moveCardLane(event) {
    // Get target Lane ID and CardId into these variables
    laneId = event.target.closest('.lane').id
    cardId = event.dataTransfer.getData("text");

    $.ajax({
        url: "/api/card/move",
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({"newLaneId": laneId, "cardId": cardId}),
        success: function(data) {
        
        },
        error: function(data) {
            alert("Unable to move card")
        }
    })
}

function newBoard() {
    window.location.replace("/newBoard");
}

document.onkeydown = function (evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        alert('Esc key pressed.');
    }
};


getBoards()