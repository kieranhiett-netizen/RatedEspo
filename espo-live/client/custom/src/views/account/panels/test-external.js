Espo.define('custom:views/account/panels/test-external', 'view', function (Dep) {

    return Dep.extend({

        // Optional: nice panel label (can also come from layout)
        label: 'Test External',

        setup: function () {
            Dep.prototype.setup.call(this);

            this.rows = [];
            this.isLoading = false;
            this.error = null;

            // Load data when the panel is created
            this.fetchData();

            // If the model is reloaded, refetch
            this.listenTo(this.model, 'sync', function () {
                this.fetchData();
            }, this);
        },

        fetchData: function () {
            var self = this;
            var id = this.model && this.model.id;

            if (!id) {
                this.rows = [];
                this.error = 'No Account ID found.';
                this.render();
                return;
            }

            this.isLoading = true;
            this.error = null;
            this.render(); // show loading state

            Espo.Ajax.getRequest('testExternalAccount/' + id)
                .then(function (response) {
                    self.isLoading = false;
                    self.rows = (response && response.rows) ? response.rows : [];
                    self.error = null;
                    self.render();
                })
                .catch(function (xhr) {
                    self.isLoading = false;
                    self.rows = [];
                    self.error = 'Failed to load external data.';
                    self.render();
                });
        },

        render: function () {
            Dep.prototype.render.call(this);

            var html = '';

            if (this.isLoading) {
                html = '<div class="text-muted">Loading external data…</div>';
            } else if (this.error) {
                html = '<div class="text-danger">' + this.error + '</div>';
            } else if (!this.rows || !this.rows.length) {
                html = '<div class="text-muted">No external data found for this account.</div>';
            } else {
                // For now, use the first row only
                var row = this.rows[0];

                html += '<table class="table table-bordered table-sm">';
                html += '<tbody>';

                html += '<tr><th>Tradesperson ID</th><td>' +
                    this.getHelper().escapeHtml(row.tradesperson_id) +
                    '</td></tr>';

                html += '<tr><th>Current Plan</th><td>' +
                    this.getHelper().escapeHtml(row.current_plan_code) +
                    '</td></tr>';

                html += '<tr><th>Next Renewal</th><td>' +
                    this.getHelper().escapeHtml(row.next_renewal_date) +
                    '</td></tr>';

                html += '<tr><th>Created At</th><td>' +
                    this.getHelper().escapeHtml(row.created_at) +
                    '</td></tr>';

                html += '</tbody>';
                html += '</table>';
            }

            this.$el.html(html);
        }

    });
});
