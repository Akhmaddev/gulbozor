<?php
namespace backend\controllers;

use Yii;
use yii\rest\Controller;
use yii\db\Query;
use yii\filters\Cors;

class IzohlarController extends Controller
{
    public function behaviors()
    {
        $b = parent::behaviors();
        // GullarController da Cors sozlamasi boʻlsa, xuddi shuni qoʻying
        $b['cors'] = ['class' => Cors::class];
        return $b;
    }

    public function actionIndex($gul_id)
    {
        return (new Query())->from('izohlar')
            ->where(['gul_id' => (int)$gul_id])
            ->orderBy('id DESC')->all();
    }

    public function actionCreate()
    {
        $d = Yii::$app->request->post();
        $matn = trim(strip_tags($d['matn'] ?? ''));
        if (mb_strlen($matn) < 3) {
            Yii::$app->response->statusCode = 422;
            return ['xato' => 'matn juda qisqa'];
        }
        $row = [
            'gul_id' => (int)($d['gul_id'] ?? 0),
            'ism'    => mb_substr(trim($d['ism'] ?? 'Mehmon'), 0, 60),
            'baho'   => max(1, min(5, (int)($d['baho'] ?? 0))),
            'matn'   => mb_substr($matn, 0, 500),
        ];
        Yii::$app->db->createCommand()->insert('izohlar', $row)->execute();
        return $row + ['id' => Yii::$app->db->getLastInsertID(), 'sana' => date('c')];
    }
}