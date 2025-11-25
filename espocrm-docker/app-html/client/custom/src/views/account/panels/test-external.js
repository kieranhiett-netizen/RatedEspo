Espo.define('custom:views/account/panels/test-external', 'view', function (Dep) {

    return Dep.extend({

        template: 'custom:account/panels/test-external',

        // Wire up the Refresh button
        events: {
            'click .test-external-refresh': function (e) {
                e.preventDefault();
                if (this.isLoading) return; // ignore clicks while already loading
                this.fetchData();
            }
        },

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

            console.log('TestExternal panel: fetchData called, id =', id);

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
                    console.log('TestExternal panel: API response', response);

                    self.isLoading = false;
                    self.rows = (response && response.rows) ? response.rows : [];
                    self.error = null;
                    self.render();
                })
                .catch(function (xhr) {
                    console.log('TestExternal panel: API error', xhr);

                    self.isLoading = false;
                    self.rows = [];
                    self.error = 'Failed to load external data.';
                    self.render();
                });
        },

        render: function () {
            Dep.prototype.render.call(this);

            // Simple escape helper to avoid XSS and avoid relying on getHelper
            function esc(v) {
                if (v === null || v === undefined) {
                    return '';
                }
                return String(v)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            }

            var html = '';

            // Top-right refresh button
            html += '<div class="clearfix" style="margin-bottom: 8px;">' +
                '<button type="button" class="btn btn-default btn-sm pull-right test-external-refresh"' +
                (this.isLoading ? ' disabled' : '') + '>' +
                (this.isLoading ? 'Refreshing…' : 'Refresh user plans') +
                '</button>' +
                '</div>';

            // Main content area
            if (this.isLoading) {
                html += '<div class="text-muted">Loading external data…</div>';
            } else if (this.error) {
                html += '<div class="text-danger">' + esc(this.error) + '</div>';
            } else if (!this.rows || !this.rows.length) {
                html += '<div class="text-muted">No external data found for this account.</div>';
            } else {
                html += '<h4 style="margin-top: 0;">Current Subscription</h4>';

                html += '<table class="table table-bordered table-sm">' +
                    '<thead>' +
                        '<tr>' +
                            '<th>Plan Name</th>' +
                            '<th>Status</th>' +
                            '<th>Start Date</th>' +
                            '<th>End Date</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>';

                // Support multiple rows in case you add more plans later
                (this.rows || []).forEach(function (row) {
                    var planName = row.current_plan_code || '';
                    var status = row.status || 'Active';
                    var startDate = row.start_date || row.created_at || '';
                    var endDate = row.end_date || row.next_renewal_date || '';

                    html += '<tr>' +
                        '<td>' + esc(planName) + '</td>' +
                        '<td>' + esc(status) + '</td>' +
                        '<td>' + esc(startDate) + '</td>' +
                        '<td>' + esc(endDate) + '</td>' +
                    '</tr>';
                });

                html += '</tbody></table>';
            }

            this.$el.html(html);
        }

    });
});
