var RatingsHelper = function (collection)
{
    var ratings = [];


    (function ()
    {
		var index = collection.length;

		while (index)
		{
			index--;

			ratings.push(parseInt(collection[index].starRating, 10));
		}
    }());


    this.getCollection = function ()
    {
    	return collection;
    };


    this.getRatings = function ()
    {
    	return ratings;
    };


    this.getAverageRating = function ()
    {
    	var length = ratings.length;
    	var index = length;
    	var sum = 0;

    	while (index)
		{
			index--;

			sum += ratings[index];
		}

		return sum / length;
    };


    this.getAverageRatingCeiled = function ()
    {
		return Math.ceil(this.getAverageRating());
    };


    this.getAverageRatingFormatted = function ()
    {
		return this.getAverageRatingCeiled() + ",0";
    };


    this.getStarDistribution = function ()
    {
    	var index = ratings.length;
    	var distribution = [0, 0, 0, 0, 0];

    	while (index)
		{
			index--;

			distribution[ratings[index] - 1] += 1;
		}

		return distribution;
    };


    this.getStarDistributionPercentages = function ()
    {
    	var distribution = this.getStarDistribution();
    	var index = distribution.length;

    	while (index)
		{
			index--;

			distribution[index] = (distribution[index] / ratings.length) * 100;
		}

		return distribution;
    };
};


$(function ()
{
	setTimeout(function ()
	{
		$.ajax(
		{
			url: "resources/reviews-alt.json",

			success: function (data)
			{
				var ratingsHelper = new RatingsHelper(data.reviews);
				var scopeTrustpilot = $(".scope-trustpilot");


				(function ()
				{
					var header = scopeTrustpilot.find("header");

					header.find("h1").html(ratingsHelper.getAverageRatingFormatted());
					header.find(".ratings").addClass("rating-" + ratingsHelper.getAverageRatingCeiled());
					header.find("h2").addClass("rating-" + ratingsHelper.getAverageRatingCeiled());
					header.find("h2 a span").html(ratingsHelper.getRatings().length);
				}());


				(function ()
				{
					var barChart = scopeTrustpilot.find("section .bar-chart");
					var barChartHtml = [];

					var starDistributionPercentages = ratingsHelper.getStarDistributionPercentages();
					var index = starDistributionPercentages.length;

					while(index)
					{
						index--;

						barChartHtml.push("<figure><figure style='width:" + starDistributionPercentages[index] + "%'></figure></figure>")
					}

					barChart.html(barChartHtml.join(""));
				}());

				scopeTrustpilot.removeClass("data-working data-error").addClass("data-loaded");
			},

			error: function ()
			{
				$(".scope-trustpilot").removeClass("data-working data-loaded").addClass("data-error");
			},
		});
	}, 1000);
});
