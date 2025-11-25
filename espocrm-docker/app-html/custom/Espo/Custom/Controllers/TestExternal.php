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

        // Get the EntityManager from the container
        $entityManager = $this->getContainer()->get('entityManager');

        // Load the Account by its Espo ID (e.g. 691b54b482cc749c3)
        $account = $entityManager->getEntity('Account', $accountId);

        if (!$account) {
            return ['rows' => []];
        }

        // Use the custom field cUserId (DB column c_user_id)
        $cUserId = $account->get('cUserId');

        if (empty($cUserId)) {
            // No external ID on this account, nothing to look up
            return ['rows' => []];
        }

        // Use PDO from the same EntityManager connection
        $pdo = $entityManager->getPDO();

        $sql = "
            SELECT id, tradesperson_id, current_plan_code, next_renewal_date, created_at
            FROM test_external
            WHERE tradesperson_id = :userId
        ";

        $sth = $pdo->prepare($sql);
        $sth->execute(['userId' => (int) $cUserId]);

        $rows = $sth->fetchAll(\PDO::FETCH_ASSOC);

        return ['rows' => $rows];
    }
}
