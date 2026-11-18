<?php

namespace backend\controllers;

use Yii;
use yii\rest\ActiveController;
use yii\data\ActiveDataProvider;
use yii\web\NotFoundHttpException;
use yii\web\UploadedFile;
use common\models\Gullar;

class GullarController extends ActiveController
{
    public $modelClass = 'common\models\Gullar';

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::class,
        ];

        return $behaviors;
    }

    protected function verbs()
    {
        $verbs = parent::verbs();
        $verbs['update-with-image'] = ['POST'];
        return $verbs;
    }

    public function actions()
    {
        $actions = parent::actions();

        // create ni o'zimiz yozamiz (rasm yuklash uchun)
        unset($actions['create']);

        // Qidiruv va filtr
        $actions['index']['prepareDataProvider'] = function ($action) {
            $query = Gullar::find();
            $params = Yii::$app->request->queryParams;

            // 1. Nom bo'yicha qidiruv (?q=orxideya)
            if (!empty($params['q'])) {
                $query->andWhere(['like', 'gulnomi', $params['q']]);
            }

            // 2. Kategoriya bo'yicha filtr (?kategoriya_id=3)
            // Qidiruv bilan birga ham ishlaydi
            if (!empty($params['kategoriya_id'])) {
                $query->andWhere(['kategoriya_id' => $params['kategoriya_id']]);
            }

            return new ActiveDataProvider([
                'query' => $query,
                'pagination' => [
                    'pageSize' => 20,
                ],
                'sort' => [
                    'defaultOrder' => [
                        'id' => SORT_DESC, // yangi gullar birinchi
                    ],
                ],
            ]);
        };

        return $actions;
    }

    /**
     * Yangi gul qo'shish (rasm bilan).
     * POST /gullar  (multipart/form-data, rasm maydoni: imageFile)
     */
    public function actionCreate()
    {
        $model = new Gullar();
        $model->load(Yii::$app->request->post(), '');
        $model->imageFile = UploadedFile::getInstanceByName('imageFile');

        if (!$model->validate()) {
            return $model; // 422 va xatolar ro'yxati avtomatik qaytadi
        }

        if (!$model->upload()) {
            $model->addError('imageFile', 'Rasmni saqlab bo\'lmadi.');
            return $model;
        }

        $model->save(false);
        Yii::$app->response->setStatusCode(201);
        return $model;
    }

    /**
     * Gulni rasm bilan yangilash.
     * POST /gullar/5/update-with-image  (multipart/form-data)
     * Oddiy PUT/PATCH rasm qabul qilmaydi, shuning uchun alohida action.
     * Rasm yuborilmasa, eski rasm saqlanib qoladi.
     */
    public function actionUpdateWithImage($id)
    {
        $model = Gullar::findOne($id);
        if (!$model) {
            throw new NotFoundHttpException('Gul topilmadi.');
        }

        $model->load(Yii::$app->request->post(), '');
        $model->imageFile = UploadedFile::getInstanceByName('imageFile');

        if (!$model->validate()) {
            return $model;
        }

        if (!$model->upload()) {
            $model->addError('imageFile', 'Rasmni saqlab bo\'lmadi.');
            return $model;
        }

        $model->save(false);
        return $model;
    }
}