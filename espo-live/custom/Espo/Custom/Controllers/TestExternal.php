<?php

namespace Espo\Custom\Controllers;

use Espo\Core\Controllers\Base;

class TestExternal extends Base
{
    // Must be static AND public to match the Base class
    public static $defaultAction = 'index';

    public function actionAccount($params, $data, $request)
    {
        $id = $params['id'] ?? null;

        if (!$id) {
            return ['rows' => []];
        }

        return $this->getService('TestExternal')->getAccountData($id);
    }
}
