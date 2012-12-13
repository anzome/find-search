var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-36942724-1']);
    _gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

chrome.extension.onMessage.addListener(
	function(request){
		_gaq.push(['_trackEvent', request.ga_category, request.ga_action, request.ga_label]);
	}
);
