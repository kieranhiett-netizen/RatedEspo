<?php

namespace Espo\Custom\Controllers;

use Espo\Core\Controllers\Base;
use Espo\Core\Api\Request;
use Espo\Core\Api\Response;

class TestExternal extends Base
{
    public function getActionAccount(Request $request, Response $response)
    {
        $accountId = $request->getRouteParam('id');

        if (!$accountId) {
            return ['rows' => []];
        }

        $entityManager = $this->getContainer()->get('entityManager');
        $account = $entityManager->getEntity('Account', $accountId);

        if (!$account) {
            return ['rows' => []];
        }

        $cUserId = $account->get('cUserId');

        if (empty($cUserId)) {
            return ['rows' => []];
        }

        $pdo = $entityManager->getPDO();

        $sql = "
            SELECT
                id,
                tradesperson_id,
                current_plan_code,
                next_renewal_date,
                created_at
            FROM test_external
            WHERE tradesperson_id = :userId
            ORDER BY next_renewal_date DESC, created_at DESC
        ";

        $sth = $pdo->prepare($sql);
        $sth->execute(['userId' => (int) $cUserId]);

        $rows = $sth->fetchAll(\PDO::FETCH_ASSOC);

        return ['rows' => $rows];
    }
}
