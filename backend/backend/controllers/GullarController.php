<?php
namespace backend\controllers;

use yii\rest\ActiveController;
use yii\data\ActiveDataProvider;
use common\models\gullar; // Model nomingiz kichik harfda bo'lsa shunday qoladi

class GullarController extends ActiveController
{
    public $modelClass = 'common\models\gullar';

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        // CORS filter - React bilan muammosiz ulanish uchun
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::class,
        ];

        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();

        // Index action-ni filtr va qidiruv bilan boyitish
        $actions['index']['prepareDataProvider'] = function ($action) {
            $query = gullar::find(); // Bazadan qidirishni boshlaymiz
            $params = \Yii::$app->request->queryParams;

            // 1. Qidiruv bo'yicha filtr (YANGI QISM)
            // 'q' parametri orqali kelgan so'zni gulnomi ichidan qidiradi
            if (isset($params['q']) && $params['q'] != '') {
                $query->andWhere(['like', 'gulnomi', $params['q']]);
            }

            // 2. Kategoriya bo'yicha filtr
            // Agar qidiruv bo'sh bo'lsa va kategoriya tanlangan bo'lsa ishlaydi
            if (isset($params['kategoriya_id']) && $params['kategoriya_id'] != '' && empty($params['q'])) {
                $query->andWhere(['kategoriya_id' => $params['kategoriya_id']]);
            }

            return new ActiveDataProvider([
                'query' => $query,
                'pagination' => [
                    'pageSize' => 20, // Bir sahifada nechta rasm chiqishi
                ],
                'sort' => [
                    'defaultOrder' => [
                        'id' => SORT_DESC, // Yangi qo'shilgan gullar birinchi chiqadi
                    ]
                ],
            ]);
        };

        return $actions;
    }
}