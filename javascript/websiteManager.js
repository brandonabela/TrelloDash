angular.module("myGameApplication", ['tableGameProgress', 'titleBannerDirective']);

jQuery(document).ready(function ($) {
    // Responsible for collapsing and expanding the side navigation

    $('.menuToggle').on('click', function(event) {
        let windowWidth = $(window).width();

        if (windowWidth < 1000) {
            $('body').removeClass('expandSideNavigation');

            if (windowWidth < 750) {
                $('sideNavigation').slideToggle();
            }
            else {
                $('sideNavigation').toggleClass('open-menu');
            }
        }
        else {
            $('body').toggleClass('expandSideNavigation');
            $('sideNavigation').removeClass('open-menu');
        }
    });

    // Responsible for adding the headers to the drop down in side navigation collapsed

    $(".menuDropDown").each(function() {
        $(this).on('click', function() {
            let $dropDownTitle = $(this).children('.menuDropDownTitle').text();
            $(this).children('.dropdown-menu').prepend('<li class="subtitle">' + $dropDownTitle + '</li>');
        });
    });
});
