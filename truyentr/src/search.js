function execute(key, page) {
    load('config.js');
    if (!page) page = '1';

    var doc = Http.get(BASE_URL + "/tim-truyen").params({
        q: key,
        page: page
    }).html();

    if (doc) {
        var el = doc.select(".row-custom > div");
        var novelList = [];
        var next = doc.select("#list-more-search-page").attr("data-page");

        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            var name = e.select(".name-book").text();
            if (!name) continue;

            var cover = e.select(".image-book").attr("data-src");
            if (!cover) cover = e.select(".image-book").attr("src");

            novelList.push({
                name: name,
                link: e.select("a").first().attr("href"),
                description: e.select(".rate").text(),
                cover: cover,
                host: BASE_URL,
            });


        }
        return Response.success(novelList, next);
    }
    return null;
}
