<?php

namespace Espo\Custom\Services;

use Espo\Core\Templates\Services\Base;
use PDO;

class TestExternal extends Base
{
    /**
     * @param string $accountId
     */
    public function getAccountData(string $accountId): array
    {
        if (empty($accountId)) {
            return ['rows' => []];
        }

        $account = $this->getEntityManager()->getEntity('Account', $accountId);

        if (!$account) {
            return ['rows' => []];
        }

        $cUserId = $account->get('cUserId');

        if (empty($cUserId)) {
            return ['rows' => []];
        }

        $rows = [];

        try {
            $pdo = $this->getEntityManager()->getPDO();
            $statement = $pdo->prepare(
                'SELECT * FROM test_external WHERE tradesperson_id = :id'
            );
            $statement->bindValue(':id', (int) $cUserId, PDO::PARAM_INT);
            $statement->execute();

            $rows = $statement->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (\Throwable $e) {
            $this->getLogger()->error(
                sprintf(
                    'Failed to fetch external data for account %s (cUserId %s): %s',
                    $accountId,
                    $cUserId,
                    $e->getMessage()
                )
            );
        }

        return ['rows' => $rows];
    }
}

