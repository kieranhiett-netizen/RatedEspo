<?php

namespace Espo\Custom\Services;

class TestExternal extends \Espo\Services\Base
{
    public function getAccountData(string $accountId): array
    {
        $account = $this->getEntityManager()->getEntity('Account', $accountId);

        if (!$account || empty($account->get('cUserId'))) {
            return ['rows' => []];
        }

        $userId = $account->get('cUserId');

        $sql = "
            SELECT *
            FROM test_external
            WHERE tradesperson_id = :userId
        ";

        $pdo = $this->getEntityManager()->getPDO();
        $sth = $pdo->prepare($sql);
        $sth->execute(['userId' => $userId]);

        return ['rows' => $sth->fetchAll(\PDO::FETCH_ASSOC)];
    }
}
