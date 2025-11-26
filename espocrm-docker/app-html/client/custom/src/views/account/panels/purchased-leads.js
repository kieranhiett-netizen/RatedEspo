Espo.define('custom:views/account/panels/purchased-leads', 'view', function (Dep) {

    return Dep.extend({

        template: 'custom:account/panels/purchased-leads',

        events: {
            'click .purchased-leads-refresh': function (e) {
                e.preventDefault();
                if (this.isLoading) return;
                this.fetchData();
            }
        },

        label: 'Purchased Leads',

        setup: function () {
            Dep.prototype.setup.call(this);

            this.rows = [];
            this.isLoading = false;
            this.error = null;

            this.fetchData();

            this.listenTo(this.model, 'sync', function () {
                this.fetchData();
            }, this);
        },

        fetchData: function () {
            var self = this;
            var id = this.model && this.model.id;

            console.log('PurchasedLeads panel: fetchData called, id =', id);

            if (!id) {
                this.rows = [];
                this.error = 'No Account ID found.';
                this.render();
                return;
            }

            this.isLoading = true;
            this.error = null;
            this.render();

            Espo.Ajax.getRequest('purchasedLeadsAccount/' + id)
                .then(function (response) {
                    console.log('PurchasedLeads panel: API response', response);

                    self.isLoading = false;
                    self.rows = (response && response.rows) ? response.rows : [];
                    self.error = null;
                    self.render();
                })
                .catch(function (xhr) {
                    console.log('PurchasedLeads panel: API error', xhr);

                    self.isLoading = false;
                    self.rows = [];
                    self.error = 'Failed to load purchased leads.';
                    self.render();
                });
        },

        render: function () {
            Dep.prototype.render.call(this);

            function esc(v) {
                if (v === null || v === undefined) return '';
                return String(v)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            }

            var html = '';

            // Toolbar with refresh
            html += '<div class="clearfix" style="margin-bottom: 8px;">' +
                '<button type="button" class="btn btn-default btn-sm pull-right purchased-leads-refresh"' +
                (this.isLoading ? ' disabled' : '') + '>' +
                (this.isLoading ? 'Refreshing…' : 'Refresh purchased leads') +
                '</button>' +
                '</div>';

            if (this.isLoading) {
                html += '<div class="text-muted">Loading purchased leads…</div>';
            } else if (this.error) {
                html += '<div class="text-danger">' + esc(this.error) + '</div>';
            } else if (!this.rows || !this.rows.length) {
                html += '<div class="text-muted">No purchased leads found for this account.</div>';
            } else {
                html += '<h4 style="margin-top: 0;">Purchased Leads</h4>';

                html += '<table class="table table-bordered table-sm">' +
                    '<thead>' +
                        '<tr>' +
                            '<th>Purchased Lead</th>' +
                            '<th>Status</th>' +
                            '<th>Job</th>' +
                            '<th>Home Owner</th>' +
                            '<th>Date</th>' +
                            '<th>Description</th>' +
                            '<th>Price</th>' +
                            '<th>Agent Verified</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>';

                (this.rows || []).forEach(function (row) {
                    var leadUrl = '#'; // placeholder – can wire to external link later
                    var jobUrl = '#';

                    html += '<tr>' +
                        '<td><a href="' + esc(leadUrl) + '" target="_blank">' +
                            esc(row.purchased_lead_id) +
                        '</a></td>' +
                        '<td>' + esc(row.status || '') + '</td>' +
                        '<td><a href="' + esc(jobUrl) + '" target="_blank">' +
                            esc(row.job_id || '') +
                        '</a></td>' +
                        '<td>' + esc(row.homeowner_name || '') + '</td>' +
                        '<td>' + esc(row.lead_date || '') + '</td>' +
                        '<td>' + esc(row.description || '') + '</td>' +
                        '<td>' + esc(row.price != null ? '£' + row.price : '') + '</td>' +
                        '<td>' + (row.agent_verified ? 'Yes' : 'No') + '</td>' +
                    '</tr>';
                });

                html += '</tbody></table>';
            }

            this.$el.html(html);
        }
    });
});
