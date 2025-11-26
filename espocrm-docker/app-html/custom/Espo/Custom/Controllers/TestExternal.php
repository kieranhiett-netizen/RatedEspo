<?php

namespace Espo\Custom\Controllers;

use Espo\Core\Controllers\Base;
use Espo\Core\Api\Request;

class TestExternal extends Base
{
    public function getActionAccountData(Request $request): array
    {
        $accountId = $request->getRouteParam('id') ?? $request->getQueryParam('id');

        if (empty($accountId)) {
            return ['rows' => []];
        }

        $service = $this->getService('TestExternal');

        return $service->getAccountData((string) $accountId);
    }
}
