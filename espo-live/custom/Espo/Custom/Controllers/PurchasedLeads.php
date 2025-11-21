<?php

namespace Espo\Custom\Controllers;

use Espo\Core\Controllers\Base;
use Espo\Core\Api\Request;
use Espo\Core\Api\Response;

class PurchasedLeads extends Base
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
                purchased_lead_id,
                status,
                job_id,
                homeowner_name,
                lead_date,
                description,
                price,
                agent_verified,
                created_at
            FROM purchased_lead
            WHERE tradesperson_id = :userId
            ORDER BY lead_date DESC, id DESC
        ";

        $sth = $pdo->prepare($sql);
        $sth->execute(['userId' => (int) $cUserId]);

        $rows = $sth->fetchAll(\PDO::FETCH_ASSOC);

        return ['rows' => $rows];
    }
}
