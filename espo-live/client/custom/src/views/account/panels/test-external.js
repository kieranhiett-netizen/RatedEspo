define('custom:views/account/panels/test-external', ['views/record/panels/bottom'], function (Dep) {

    return Dep.extend({

        // Should match the panel key in bottomPanelsDetail.json
        name: 'testExternal',

        template: 'custom:account/panels/test-external',

        init: function () {
            Dep.prototype.init.call(this);
            this.rows = [];
        },

        setup: function () {
            Dep.prototype.setup.call(this);

            // Reload panel data when the record changes, just in case
            if (this.model) {
                this.listenTo(this.model, 'after:save', this.loadData, this);
            }

            this.loadData();
        },

        loadData: function () {
            var id = this.model && this.model.id;
            var self = this;

            if (!id) {
                this.rows = [];
                this.reRender();
                return;
            }

            this.ajaxGetRequest('TestExternal/account/' + id)
                .then(function (data) {
                    try {
                        self.rows = data && data.rows ? data.rows : [];
                        self.reRender();
                    } catch (e) {
                        console.error('TestExternal panel render error (then):', e);
                    }
                })
                .catch(function (e) {
                    console.error('TestExternal panel error (ajax):', e);
                    self.rows = [];
                    try {
                        self.reRender();
                    } catch (e2) {
                        console.error('TestExternal panel render error (catch):', e2);
                    }
                });
        },

        data: function () {
            var parentData = Dep.prototype.data.call(this) || {};
            var rows = this.rows || [];

            return _.extend({}, parentData, {
                rows: rows,
                hasRows: rows.length > 0,
                firstRow: rows.length ? rows[0] : null
            });
        },
    });
});
