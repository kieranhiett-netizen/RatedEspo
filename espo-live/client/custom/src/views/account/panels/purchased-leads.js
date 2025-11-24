Espo.define('custom:views/account/panels/purchased-leads', 'custom:views/account/panels/external-data', function (Dep) {

    return Dep.extend({

        title: 'Purchased Leads',
        refreshLabel: 'Refresh purchased leads',
        emptyText: 'No purchased leads were found for this account.',
        endpoint: 'purchasedLeadsAccount/',

        columns: [
            { name: 'purchased_lead_id', label: 'Lead' },
            { name: 'status', label: 'Status' },
            { name: 'job_id', label: 'Job' },
            { name: 'homeowner_name', label: 'Home owner' },
            { name: 'lead_date', label: 'Date', type: 'date' },
            { name: 'description', label: 'Description' },
            { name: 'price', label: 'Price', type: 'currency', currencySymbol: '£' },
            { name: 'agent_verified', label: 'Agent verified', type: 'bool' }
        ]

    });
});
