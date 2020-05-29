Vue.component('filter-bar', {
    props: ["card-screen"],
    data: function() {
        return {
            state: {
                sort: "",
                filter: {
                    topic: "",
                    language: "",
                },
            },
            firstFilter: true,
        };
    },
    computed: {
        topicsWithProjects: function() {
            return this.$parent.$refs["topic-cards"].topicsdataprop
        },
        allLanguages: function() {
            return this.$parent.$refs["language-cards"].languagesdataprop
        },
        sortBy: {
            set: function(value) {
                this.state.sort = value;
            },
            get: function() {
                return this.state.sort
            }
        },
        filterTopic: {
            set: function(value) {
                this.state.filter.topic = value;
            },
            get: function() {
                return this.state.filter.topic
            }
        },
        filterLanguage: {
            set: function(value) {
                this.state.filter.language = value;
            },
            get: function() {
                return this.state.filter.language
            }
        },
    },
    methods: {
        filterData: function(data) {
            vue = this;
            filtered = []

            for (let i = 0; i < data.length; i++) {
                if (
                    (data[i].topic.indexOf(vue.state.filter.topic) > -1 || vue.state.filter.topic === "") &&
                    (data[i].language.indexOf(vue.state.filter.language) > -1 || vue.state.filter.language === "")
                    ) {
                    filtered.push(data[i])
                }
            };

            return filtered;
        },
        sortData: function(data) {
            return data.sort(function(a, b) {
                return new Date(a) - new Date(b)
            })
        }
    },
    watch: {
        state: {
            handler: function() {
                let cards = vm.$refs["project-cards"];
                if (this.firstFilter) {
                    cards.projectsdata = this.$parent.projectsData;
                    this.firstFilter = false;
                };
                cards.projectsdata = this.sortData(this.filterData(cards.originalProjectData));
            },
            deep: true,
        }
    },
    template:
    `
    <form class="filter-form">
        <div class="filter-bar">
            <div>
                <label for="topic-select">Topic: </label>
                <select id="topic-select" v-model="filterTopic">
                    <option></option>
                    <option v-for="topic in topicsWithProjects" :key="topic.id">
                        {{ topic.name }}
                    </option>
                </select>
            </div>
            <div>
                <label for="language-select">Language: </label>
                <select id="language-select" v-model="filterLanguage">
                    <option></option>
                    <option v-for="language in allLanguages" :key="language.id">
                        {{ language.name }}
                    </option>
                </select>
            </div>
            <div>
                <label for="sort-select">Sort by: </label>
                <select id="sort-select" v-model="sortBy">
                    <option>Newest first</option>
                    <option>Oldest first</option>
                </select>
            </div>
        </div>
    </form>
    `
});

Vue.component('cards', {
    props: ["type", "topicsdataprop", "languagesdataprop", "projectsdataprop"],
    data: function() {
        return {
            localProjectsData: null,
            projectsDataLoaded: false,
            cardInfo: false,
            cardOpened: false,
            cardInfoData: {
                title: "",
                description: "",
                topics: "",
                longDescription: "",
                language: "",
                link: "",
                start: "",
                end: "",
            },
        }
    },
    computed: {
        originalProjectData: function() {
            return this.$parent.projectsData
        },
        projectsdata: {
            get: function() {
                if (this.localProjectsData === null || !this.projectsDataLoaded) {
                    return this.projectsdataprop
                } else {
                    return this.localProjectsData
                }
            },
            set: function(new_project_data) {
                if (new_project_data.length > 0) {
                    this.projectsDataLoaded = true;
                }
                this.localProjectsData = new_project_data;
            },
        },
    },
    methods: {
        zoomCard: function(event) {
            try {
                let card = $(event.target).parent();
                let distance = (card.find(".card-desc").offset().top + card.find(".card-desc").height()) - (card.offset().top + card.height());
                if (distance > 10) {
                    card.animate({height: "+=" + distance}, 300)
                };
             } catch(TypeError) {}
        },
        unZoomCard: function(event) {
            let cards = $(".card");
            for (let i = 0; i < cards.length; i++) {
                let current = $(cards[i]);
                if (!(current.is(":hover"))) {
                    var normalHeight = current.height();
                    break;
                };
            };
            let card = $(event.target).parent();
            card.animate({height: normalHeight}, 300);
        },
        getCardTopics: function(card) {
            if (card.topic.length === 1) {
                return card.topic[0]
            };
            let max = 2;
            let topics = card.topic;
            displayed_topics = []
            for (let i = 0; i < max; i++) {
                try {
                    displayed_topics.push(topics[i]);
                } catch {
                    break
                };
            };
            let extra = "";
            if (card.topic.length > max) {
                extra = ", ..."
            };
            return displayed_topics.join(", ") + extra;
        },
        filterAndChangePage: function(filter, value) {
            switch (filter) {
                case 'topic':
                    filter = this.$parent.$refs['filter-bar'];
                    filter.filterTopic = value;
                    filter.filterLanguage = "";
                    break;

                case 'language':
                    filter = this.$parent.$refs['filter-bar'];
                    filter.filterLanguage = value;
                    filter.filterTopic = "";
                    break;
            }
            this.$parent.changePage('#projects');
        },
        showInfo: function(card) {
            let info = this.cardInfoData
            info.title = card.name;
            info.description = card.description;
            info.longDescription = card.notes;
            info.language = card.language.join(", ");
            info.start = card.start;
            info.end = card.finished;
            info.topics = card.topic.join(", ");
            info.link = card.github;

            this.cardInfo = true;

            vue = this;
            $(".card-info").animate({opacity: 1}, 300, function() {
                vue.cardOpened = true;
            });
        },
        closeCard: function() {
            vue = this;
            $(".card-info").animate({opacity: 0}, 300, function() {
                vue.cardInfo = false;
                vue.cardOpened = false;
            });
        },
    },
    template:
    `
    <div>
        <div class="card-container" v-if="type === 'project'">
            <div v-for="card in projectsdata" :key="card.id" class="card">
                <div class="innerCard">
                    <p><strong>{{ card.name }}</strong></p>
                    <p>{{ getCardTopics(card) }}</p>
                    <p class="card-desc">{{ card.description }}<br></p>
                </div>
                <div
                    class="innerCardShadow"
                    @mouseover="zoomCard($event)"
                    @mouseout="unZoomCard($event)"
                    @click="showInfo(card)">
                    </div>
            </div>
        </div>
        <div class="card-container" v-else-if="type === 'topic'">
            <div v-for="card in topicsdataprop" :key="card.id" class="card">
                <div class="innerCard">
                    <p><strong>{{ card.name }}</strong></p>
                    <p class="card-desc">{{ card.description }}</p>
                </div>
                <div
                    class="innerCardShadow"
                    @mouseover="zoomCard($event)"
                    @mouseout="unZoomCard($event)"
                    @click="filterAndChangePage('topic', card.name)"
                ></div>
            </div>
        </div>
        <div class="card-container" v-else-if="type === 'language'">
            <div v-for="card in languagesdataprop" :key="card.id" class="card">
                <div class="innerCard">
                    <p style="margin-top: 20%;"><strong>{{ card.name }}</strong></p>
                </div>
                <div
                    class="innerCardShadow"
                    @mouseover="zoomCard($event)"
                    @mouseout="unZoomCard($event)"
                    @click="filterAndChangePage('language', card.name)"
                    ></div>
            </div>
        </div>
        <div class="card-info-container" v-show="cardInfo">
            <div class="card-info">
                <p class="card-info-title">{{ cardInfoData.title }}</p>
                <p>{{ cardInfoData.description }}</p>
                <p>{{ cardInfoData.language }}</p>
                <p>{{ cardInfoData.topics }}</p>
                <p>{{ cardInfoData.start }} - {{ cardInfoData.end }}</p>
                <a :href="cardInfoData.link" target="_blank" style="color: white;">Github</a>
                <hr>
                <p>{{ cardInfoData.longDescription }}</p>
            </div>
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

$(document).on("click", function(e) {
    if (vm.$refs["project-cards"].cardOpened && $(e.target).parents(".card-info").length === 0) {
        vm.$refs["project-cards"].closeCard()
    };
})
