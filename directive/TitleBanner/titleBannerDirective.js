const titleBannerDirective = angular.module("titleBannerDirective", []);

titleBannerDirective.directive('titleBanner', function() {
    return {
        restrict: 'EA',
        templateUrl: 'directive/TitleBanner/titleBannerDirective.html',
        scope: {
            title: '@'
        }
    };
});
