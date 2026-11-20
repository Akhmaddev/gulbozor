<?php

namespace backend\controllers;

use Yii;
use yii\rest\ActiveController;
use yii\data\ActiveDataProvider;
use yii\web\NotFoundHttpException;
use yii\web\UploadedFile;
use yii\web\UnauthorizedHttpException;
use yii\web\ForbiddenHttpException;
use common\models\Gullar;


class GullarController extends ActiveController
{
    public $modelClass = 'common\models\Gullar';

    /**
     * Controller himoyasi va CORS
     */
    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::class,
        ];

        return $behaviors;
    }

    /**
     * Admin huquqini tekshirish
     */
    private function isAdmin()
    {
        $user = Yii::$app->user;

        if ($user->isGuest) {
            return false;
        }

        $identity = $user->identity;

        // Yii2 RBAC orqali tekshirish
        if ($user->can('admin')) {
            return true;
        }

        // User modelida role ustuni bo'lsa
        if (
            isset($identity->role) &&
            $identity->role === 'admin'
        ) {
            return true;
        }

        return false;
    }

    /**
     * POST, PUT, PATCH, DELETE faqat admin uchun.
     * GET orqali mahsulotlarni ko'rish ochiq qoladi.
     */
    public function beforeAction($action)
    {
        $request = Yii::$app->request;

        if (!$request->isOptions) {

            $method = strtoupper($request->getMethod());

            $writeMethods = [
                'POST',
                'PUT',
                'PATCH',
                'DELETE',
            ];

            if (in_array($method, $writeMethods, true)) {

                if (Yii::$app->user->isGuest) {
                    throw new UnauthorizedHttpException(
                        'Iltimos, avval tizimga kiring.'
                    );
                }

                if (!$this->isAdmin()) {
                    throw new ForbiddenHttpException(
                        'Bu amalni faqat administrator bajarishi mumkin.'
                    );
                }
            }
        }

        return parent::beforeAction($action);
    }

    /**
     * HTTP metodlari
     */
    protected function verbs()
    {
        $verbs = parent::verbs();

        $verbs['update-with-image'] = ['POST'];

        return $verbs;
    }

    /**
     * CRUD actions
     */
    public function actions()
    {
        $actions = parent::actions();

        // Create ni o'zimiz boshqaramiz
        unset($actions['create']);

        // Qidiruv va filtr
        $actions['index']['prepareDataProvider'] = function ($action) {

            $query = Gullar::find();

            $params = Yii::$app->request->queryParams;

            // Gul nomi bo'yicha qidiruv
            if (!empty($params['q'])) {
                $query->andWhere([
                    'like',
                    'gulnomi',
                    $params['q']
                ]);
            }

            // Kategoriya bo'yicha filtr
            if (!empty($params['kategoriya_id'])) {
                $query->andWhere([
                    'kategoriya_id' => $params['kategoriya_id']
                ]);
            }

            return new ActiveDataProvider([
                'query' => $query,

                'pagination' => [
                    'pageSize' => 20,
                ],

                'sort' => [
                    'defaultOrder' => [
                        'id' => SORT_DESC,
                    ],
                ],
            ]);
        };

        return $actions;
    }

    /**
     * Yangi gul qo'shish
     * POST /gullar
     */
    public function actionCreate()
    {
        $model = new Gullar();

        $model->load(Yii::$app->request->post(), '');

        $model->imageFile = UploadedFile::getInstanceByName(
            'imageFile'
        );

        if (!$model->validate()) {
            return $model;
        }

        if (!$model->upload()) {

            $model->addError(
                'imageFile',
                'Rasmni saqlab bo\'lmadi.'
            );

            return $model;
        }

        $model->save(false);

        Yii::$app->response->setStatusCode(201);

        return $model;
    }

    /**
     * Gulni rasm bilan yangilash
     * POST /gullar/5/update-with-image
     */
    public function actionUpdateWithImage($id)
    {
        $model = Gullar::findOne($id);

        if (!$model) {
            throw new NotFoundHttpException(
                'Gul topilmadi.'
            );
        }

        $model->load(Yii::$app->request->post(), '');

        $model->imageFile = UploadedFile::getInstanceByName(
            'imageFile'
        );

        if (!$model->validate()) {
            return $model;
        }

        if (!$model->upload()) {

            $model->addError(
                'imageFile',
                'Rasmni saqlab bo\'lmadi.'
            );

            return $model;
        }

        $model->save(false);

        return $model;
    }
}
