let vm = new Vue({
    el: "#site-container",
    delimiters: ["{$", "$}"],
    data: {
        currentPage: window.location.hash,
        projectsData: [],
        topicsData: [],
        languagesData: [],
        pages: ["#home", "#topics", "#languages", "#projects"],
    },
    methods: {
        changePage: function(new_hash) {
            let currentPage = $(this.$refs[this.currentPage]);
            let nextPage = $(this.$refs[new_hash]);
            if (new_hash === this.currentPage || this.pages.indexOf(new_hash) === -1) {
                window.location.hash = this.currentPage;
                return;
            }
            nextPage.css("display", "initial");
            currentPage.animate({left: "-100%"}, 500, function() {
                currentPage.css("left", 0);
            });
            nextPage.css("left", "100%");
            nextPage.animate({left: "0"}, 500, function() {
                vm.currentPage = new_hash;
            });
            window.location.hash = new_hash;
        },
        loadApi: function() {
            // call the api to get data
            let vue = this;
            let urls = ["/api/projects/?format=json", "/api/topics/?format=json", "/api/languages/?format=json"];
            let requests = [];

            for (let i = 0; i < urls.length; i++) {
                let r = $.get(urls[i], function(data, status) {
                    if (status === "success") {}
                    else {
                        alert("Server responded incorrectly.");
                    };
                });
                requests.push(r);
            };

            $.when(requests[0], requests[1], requests[2]).done(function() {
                let projectsData = requests[0].responseJSON;
                let topicsData = requests[1].responseJSON;
                let languagesData = requests[2].responseJSON;

                for (let i = 0; i < topicsData.length; i++) {
                    let formatted_languages = [];
                    for (let y = 0; y < topicsData[i].language.length; y++) {
                        formatted_languages[y] = languagesData.find(function(item) {
                            return item.id === topicsData[i].language[y];
                        })["name"]
                    }
                   topicsData[i].language = formatted_languages;
                };

                for (let i = 0; i < projectsData.length; i++) {
                    let formatted_topics = [];
                    let formatted_languages = [];

                    for (let y = 0; y < projectsData[i].topic.length; y++) {
                        formatted_topics[y] = topicsData.find(function(item) {
                            return item.id === projectsData[i].topic[y];
                        })["name"];
                    };

                    for (let y = 0; y < projectsData[i].language.length; y++) {
                        formatted_languages[y] = languagesData.find(function(item) {
                            return item.id === projectsData[i].language[y];
                        })["name"];
                    };
                    projectsData[i].topic = formatted_topics;
                    projectsData[i].language = formatted_languages;
                };
                vue.languagesData = languagesData;
                vue.projectsData = projectsData;
                vue.topicsData = topicsData;
            })
        },
    },
})

$(window).on("hashchange", function(e) {
    vm.changePage("#" + e.originalEvent.newURL.split("#")[1]);
})
