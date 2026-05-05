<?php
namespace backend\controllers;

use yii\rest\ActiveController;
use yii\data\ActiveDataProvider;
use common\models\gullar; // Если имя модели начинается с маленькой буквы, оставьте так

class GullarController extends ActiveController
{
    public $modelClass = 'common\models\gullar';

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        // CORS filter - для подключения фронтенда (например, React)
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::class,
        ];

        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();

        // Расширяем actionIndex фильтрацией и поиском
        $actions['index']['prepareDataProvider'] = function ($action) {
            $query = gullar::find(); // Начинаем поиск
            $params = \Yii::$app->request->queryParams;

            // 1. Поиск по названию (параметр 'q')
            if (isset($params['q']) && $params['q'] != '') {
                $query->andWhere(['like', 'gulnomi', $params['q']]);
            }

            // 2. Фильтр по категории
            // Работает, если выбран поиск или выбрана конкретная категория
            if (isset($params['kategoriya_id']) && $params['kategoriya_id'] != '' && empty($params['q'])) {
                $query->andWhere(['kategoriya_id' => $params['kategoriya_id']]);
            }

            return new ActiveDataProvider([
                'query' => $query,
                'pagination' => [
                    'pageSize' => 20, // Количество элементов на одной странице
                ],
                'sort' => [
                    'defaultOrder' => [
                        'id' => SORT_DESC, // Новые цветы выходят первыми
                    ]
                ],
            ]);
        };

        return $actions;
    }
}