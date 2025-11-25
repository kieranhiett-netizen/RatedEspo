<div class="clearfix" style="margin-bottom: 8px;">
    <button type="button" class="btn btn-default btn-sm pull-right test-external-refresh" {{#if isLoading}}disabled{{/if}}>
        {{#if isLoading}}Refreshing…{{else}}Refresh{{/if}}
    </button>
</div>

{{#if isLoading}}
    <div class="text-muted">Loading external records…</div>
{{else if error}}
    <div class="text-danger">{{error}}</div>
{{else if hasRows}}
    <table class="table table-bordered table-sm">
        <thead>
            <tr>
                <th>Tradesperson ID</th>
                <th>External Ref</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Data</th>
            </tr>
        </thead>
        <tbody>
            {{#each rows}}
                <tr>
                    <td>{{tradespersonId}}</td>
                    <td>{{externalRef}}</td>
                    <td>{{createdAt}}</td>
                    <td>{{updatedAt}}</td>
                    <td style="white-space: pre-wrap; max-width: 360px;">{{dataPreview}}</td>
                </tr>
            {{/each}}
        </tbody>
    </table>
{{else}}
    <div class="text-muted">No external records found.</div>
{{/if}}
