<?php

namespace Espo\Custom\Controllers;

use Espo\Core\Controllers\Base;

class TestExternal extends Base
{
    // IMPORTANT: Controller actions MUST be named "actionXyz"
    // and no defaultAction override unless explicitly needed.

    public function actionGetAccount($params, $data, $request)
    {
        $id = $params['id'] ?? null;

        if (!$id) {
            return ['rows' => []];
        }

        return $this->getService('TestExternal')->getAccountData($id);
    }
}
