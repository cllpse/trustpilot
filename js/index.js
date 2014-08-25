var Ratings = function (collection)
{
    var ratings = [];
    var stars = [];


    (function () /* populate ratings array */
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

		return Math.ceil(sum / (length - 1));
    };
};


$(function ()
{
	$.ajax(
	{
		url: "resources/reviews.json",

		success: function (data)
		{
			window.ratings = new Ratings(data.reviews);
		},

		error: function ()
		{
			console.log("error", arguments);
		},
	})
});
