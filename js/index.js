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


    this.getStarDistributionInDegrees = function ()
    {
    	var distribution = this.getStarDistribution();
    	var index = distribution.length;
    	var distributionFormatted = [0, 0, 0];

    	while (index)
		{
			index--;

			var n = (distribution[index] / ratings.length) * 360;

			if (index === 0)
			{
				distributionFormatted[0] = n;
			}
			else if (index > 0 && index < 3)
			{
				distributionFormatted[1] = distributionFormatted[1] + n;
			}
			else
			{
				distributionFormatted[2] = distributionFormatted[2] + n;
			}
		}

		return distributionFormatted;
    };


    this.getStarDistributionPercentages = function (options)
    {
    	var configuration = $.extend({}, { floor: false, ceil: false, formatNumbers: false }, options);
    	var distribution = this.getStarDistribution();
    	var index = distribution.length;

    	while (index)
		{
			index--;

			var n = (distribution[index] / ratings.length) * 100;

			if (configuration.floor) n = Math.floor(n);
			if (configuration.ceil) n = Math.ceil(n);
			if (configuration.formatNumbers) n = n + "%";

			distribution[index] = n;
		}

		return distribution;
    };
};


$(function ()
{
	$.ajax(
	{
		url: "json/reviews-alt.json",
		cache: false,

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

				var starDistributionPercentages = ratingsHelper.getStarDistributionPercentages({ floor: true });
				var index = starDistributionPercentages.length;

				while(index)
				{
					index--;

					barChartHtml.push("<figure><figure style='width:");
					barChartHtml.push(starDistributionPercentages[index]);
					barChartHtml.push("%'></figure></figure>");
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
});


var PieChartGenerator = function (collection)
{
	var pieColors = ["#35d888", "#faac49", "#fa4949"];


	var degreesToRadians = function (degrees)
	{
    	return (degrees * Math.PI) / 180;
	};


	var getStartingDegrees = function (index)
	{
		var sum = 0;

		for (var j = 0; j < index; j++)
		{
			sum += collection[j];
		}

		return sum;
	};


	this.draw = function (canvas)
	{
		var context = canvas.getContext("2d");
		var index = collection.length;
		var collectionReversed = collection.reverse();

		while(index)
		{
			index--;

			context.save();

		    var x = Math.floor(canvas.width / 2);
		    var y = Math.floor(canvas.height / 2);
		    var r = Math.floor(canvas.width / 2);

		    var start = degreesToRadians(getStartingDegrees(index));
		    var end = start + degreesToRadians(collectionReversed[index]);

		    context.beginPath();
		    context.moveTo(x, y);
		    context.arc(x, y, r, start, end, false);
		    context.closePath();
		    context.fillStyle = pieColors[index];
		    context.fill();
		    context.restore();
		}
	};
};


$(function ()
{
	var scopeTrustpilot = $(".scope-trustpilot");
	var canvas = scopeTrustpilot.find("canvas").get(0);

	if (!canvas) return;

	$.ajax(
	{
		url: "json/reviews-alt.json",
		cache: false,

		success: function (data)
		{
			var ratingsHelper = new RatingsHelper(data.reviews);
			var pieChartGenerator = new PieChartGenerator(ratingsHelper.getStarDistributionInDegrees());

			pieChartGenerator.draw(canvas);

			scopeTrustpilot.removeClass("data-working data-error").addClass("data-loaded");
		},

		error: function ()
		{
			$(".scope-trustpilot").removeClass("data-working data-loaded").addClass("data-error");
		},
	});
});























