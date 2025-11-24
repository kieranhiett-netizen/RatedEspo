Espo.define('custom:views/account/panels/test-external', 'custom:views/account/panels/external-data', function (Dep) {

    return Dep.extend({

        title: 'Subscription Details',
        refreshLabel: 'Refresh subscriptions',
        emptyText: 'No subscription data was returned for this account.',
        endpoint: 'testExternalAccount/',

        columns: [
            { name: 'tradesperson_id', label: 'User ID' },
            { name: 'current_plan_code', label: 'Plan' },
            { name: 'next_renewal_date', label: 'Next renewal', type: 'date' },
            { name: 'created_at', label: 'Created', type: 'dateTime' }
        ]

    });
});
