// Function is responsible on detecting when the user stores to add the class to navigation bar

$(document).scroll("scroll", function() {
    if ($(document).scrollTop() > 0)
    {
        $(".navigationSection .navbar").addClass("navbarScrolled");
    }
    else
    {
        $(".navigationSection .navbar").removeClass("navbarScrolled");
    }
});
