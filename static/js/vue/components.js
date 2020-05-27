Vue.component('cards', {
    props: ["type"],
    data() {
        return {
            apiData: [],
            componentKey: 0,
        };
    },
    methods: {
        update: function() {
            this.componentKey += 1;
        },
        getData: function() {
            // call the api to get data for the given type of card
            let vue = this;
            let url;
            let infoUrl;
            switch (this.type) {
                case "project":
                    url = "/api/projects/?format=json";
                    infoUrl = "/api/topics/?format=json";
                    break;
                case "topic":
                    url = "/api/topics/?format=json";
                    infoUrl = "/api/languages/?format=json";
                    break;
                case "language":
                    url = "/api/languages/?format=json";
                    break;
            };
            response = $.get(url, function(data, status) {
                if (status === "success") {
                    var main_data = data;
                } else {
                    alert("Server responded incorrectly.");
                };
                if (infoUrl) {
                    $.get(infoUrl, function(data, status) {
                        if (status === "success") {
                            var info_data = data;
                            if (main_data[0]["language"]) {
                                // type is topics
                                for (let i = 0; i < main_data.length; i++) {
                                    let formatted_languages = [];
                                    for (let y = 0; y < main_data[i].language.length; y++) {
                                        formatted_languages[y] = info_data.find(function(item) {
                                            return item.id === main_data[i].language[y];
                                        })["name"]
                                    }
                                    main_data[i].language = formatted_languages;
                                }
                            } else {
                                // type is projects
                                for (let i = 0; i < main_data.length; i++) {
                                    let formatted_topics = [];
                                    for (let y = 0; y < main_data[i].topic.length; y++) {
                                        formatted_topics[y] = info_data.find(function(item) {
                                            return item.id === main_data[i].topic[y];
                                        })["name"]
                                    }
                                    main_data[i].topic = formatted_topics;
                                }
                            }
                        } else {
                            alert("Server responded incorrectly.");
                        };
                    });
                };
                vue.apiData = main_data;
            });
        },
    },
    watch: {
        apiData: {
            handler(val) {this.update()},
            deep: true,
        }
    },
    template:
    `
    <div class="card-container" v-if="type === 'project'">
        <div v-for="card in apiData" :key="card.id" class="card">
            <div class="innerCard">
                <p>{{ card.name }}</p>
            </div>
            <div class="innerCardShadow"></div>
        </div>
    </div>
    <div class="card-container" v-else-if="type === 'topic'">
        <div v-for="card in apiData" :key="card.id" class="card">
            <div class="innerCard">
                <p>{{ card.name }}</p>
                <p>{{ card.description }}</p>
            </div>
            <div class="innerCardShadow"></div>
        </div>
    </div>
    <div class="card-container" v-else-if="type === 'language'">
        <div v-for="card in apiData" :key="card.id" class="card">
            <div class="innerCard">
                <p>{{ card.name }}</p>
            </div>
            <div class="innerCardShadow"></div>
        </div>
    </div>
    `
})

Vue.component('nav-bar', {
    props: ["headers"],
    data: function() {
        return {
            forceClose: false,
        }
    },
    methods: {
        toggleDropdown: function(title) {
            if (title in this.$refs && !this.forceClose) {
                let el = this.$refs[title][0];
                $(el).stop();
                $(el).slideToggle("fast");
            }
        },
        openDropdown: function(title) {
            if (title in this.$refs && !this.forceClose) {
                let el = this.$refs[title][0];
                $(el).slideDown("fast");
            }
        },
        closeDropdown: function(title) {
            if (title in this.$refs) {
                let vue = this;
                let el = this.$refs[title][0];
                $(el).stop();
                $(el).slideUp("fast", function() {
                    vue.forceClose = false;
                });
                this.forceClose = true;
            }
        },
        changeHash: function(new_hash, title) {
            this.closeDropdown(title);
            this.$emit("change-page", new_hash);
        },
        checkMouseOutChildren: function(title) {
            if (title in this.$refs && !this.forceClose) {
                if ($("#navbar").is(":hover")) {return}
                let el = this.$refs[title][0];
                let children = el.children;
                for (let i = 0; i < children.length; i++) {
                    if ($(children[i]).is(":hover")) {
                        return
                    }
                }
                this.closeDropdown(title)
            }
        },
    },
    computed: {
        headers_with_dropdown: function() {
            // returns headers that have dropdown: true
            return this.headers.filter(function(item) {
                return item.dropdown
            });
        },
    },
    template:
    `
        <div id='navbar'>
            <div id="navbar-option-container">
                <div
                    v-for='header in headers'
                    :key='header.id'
                >
                    <p
                        style="display:inline-block;"
                        @click="changeHash(header.page, header.text)"
                        @mouseover="openDropdown(header.text)"
                    >
                    {{ header.text }}
                    </p>
                    <span v-if="header.dropdown">
                        <img class="dropdown-icon" src="/static/dropdown.svg" @click="toggleDropdown(header.text)">
                    </span>
                </div>
            </div>
            <div
                class="navbar-dropdown"
                v-for="dropdown in headers_with_dropdown"
                :ref="dropdown.text"
                :key="dropdown.id"
                @mouseout="checkMouseOutChildren(dropdown.text)"
            >
                <div class="dropdown-option-container">
                    <a v-for="option in dropdown.options" @click="function() {closeDropdown(dropdown.text); changeHash(option.page, dropdown.text)}">
                        {{ option.text }}
                    </a>
                </div>
            </div>
        </div>
    `,
});
