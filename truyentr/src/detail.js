function slugify(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
        .replace(/đ/g, "d")
        .replace(/[\s–—]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
function execute(url) {
    load('config.js');

    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    var doc = Http.get(url).html();
    var ps = doc.select(".content1 > p");
    var description = "";
    for (var i = 0; i < ps.size(); i++) {
        var html = ps.get(i).html().trim();
        if (html.length > 0) {
            description += "<p>" + html + "</p>";
        }
    }
    var genres = [];
    var seen = {};
    var spans = doc.select(".content1 span[itemprop=genre]");
    // lấy từ HTML
    for (var i = 0; i < spans.size(); i++) {
        var title = spans.get(i).text().trim();

        if (!title || seen[title]) continue;
        seen[title] = true;
        genres.push({
            title: title,
            input: slugify(title),
            script: "gen.js"
        });
    }

    if (doc) {
        return Response.success({
            name: doc.select("h1.title").text(),
            cover: doc.select(".col-12.col-md-4.text-center img").attr("data-src"),
            host: BASE_URL,
            author: doc.select(".content1 > div > p:nth-child(1)").text(),
            description: description,
            detail: doc.select(".content1 > div > p:nth-child(3)").html(),
            genres: genres
        });
    }
    return null;
}