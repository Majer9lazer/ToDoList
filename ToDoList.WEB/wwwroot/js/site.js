// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
const { createApp } = Vue;

createApp({
    data() {
        return {
            message: 'Hello Vue!',
            image: '',
            user: {},
            toDoItems: [],
            toDoItem: {
                text: 'Fix problems',
                creationDate: '2023-01-25',
                updateDate: '',
                isDeleted: false,
                isFinished: false,
                user: {}
            },
            selectedToDoItem: {},
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        }
    },
    methods: {
        createToDoItem: async function () {
            var addToDoItemResponse = await window.fetch(`api/ToDoItems`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(
                        {
                            text: this.toDoItem.text,
                            creationDate: this.toDoItem.creationDate,
                            isDeleted: this.toDoItem.isDeleted,
                            isFinished: this.toDoItem.isFinished,
                            user: {
                                visitorId: this.toDoItem.user.visitorId
                            }
                        },
                    )
                });
            if (addToDoItemResponse.ok) {
                var addedToDoItem = await addToDoItemResponse.json();
                console.log(this.toDoItem);
                this.toDoItems.push(addedToDoItem);
                this.toDoItem.text = '';
                /*
                 * {
                    id:addedToDoItem.id,
                    text: this.toDoItem.text,
                    creationDate: this.toDoItem.creationDate,
                    updateDate: this.toDoItem.updateDate,
                    isDeleted: this.toDoItem.isDeleted,
                    isFinished: this.toDoItem.isFinished,
                    user: this.toDoItem.user
                }
                 */
            } else {
                alert('Error while adding todo item');
            }
        },
        updateToDoItem: async function (toDoItem) {
            var updateToDoItemResponse = await window.fetch(`api/ToDoItems/${toDoItem.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(
                        {
                            id: toDoItem.id,
                            text: toDoItem.text,
                            creationDate: toDoItem.creationDate,
                            isDeleted: toDoItem.isDeleted,
                            isFinished: toDoItem.isFinished,
                            userId: toDoItem.userId
                        },
                    )
                });

            if (!updateToDoItemResponse.ok) {
                alert('error while updating ToDoItem');
            }
        },
        deleteToDoItem: async function (toDoItem) {

            var deleteToDoItemResponse = await window.fetch(`api/ToDoItems/${toDoItem.id}`,
                {
                    method: 'DELETE'
                });

            if (deleteToDoItemResponse.ok) {
                this.toDoItems.splice(this.toDoItems.indexOf(toDoItem), 1);
            } else {
                alert('error while deleting the ToDoItem');
            }
        },
        finishToDoItem: async function (toDoItem) {
            if (toDoItem.isFinished === true) {
                toDoItem.isFinished = false;
            } else {
                toDoItem.isFinished = true;
            }
            await this.updateToDoItem(toDoItem);
        },
        createUserIfNecessary: async function (fingerprintRes) {
            var response = await window.fetch(`api/users/${this.visitorId}`);
            var user;
            if (response.status === 404) {
                user = { visitorId: fingerprintRes.visitorId };

                var addResponse = await window.fetch(`api/users`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify(user)
                    });

                if (!addResponse.ok) {
                    alert('error when creating user');
                }
            } else {
                user = await response.json();
                console.log(user);
                this.user = user;
                this.toDoItems = user.toDoItems;
            }
            this.toDoItem.user = user;
        },
        dayOfTheDate: function (date) {
            return this.days[new Date(date).getDay()];

        }
    },
    mounted: async function () {
        fpPromiseResult.then(async (res) => {
            this.visitorId = res.visitorId;
            await this.createUserIfNecessary(res);
        });
    },
    computed: {
        groupedToDoItems: function () {
            if (this.toDoItems.length > 0) {
                var res = groupBy(this.toDoItems, 'creationDate');
                console.log(res);
                return res;
            } else {
                return [];
            }
        },
        addToDoItemButtonClass: function () {
            if (this.toDoItem.text.length <= 0) {
                return 'btn btn-primary disabled';
            } else {
                return 'btn btn-primary';
            }
        },

    }
}).mount('#indexMainBlock');

var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    },
        {});
};

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];