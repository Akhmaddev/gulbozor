<?php

use common\models\Gullar;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\grid\ActionColumn;
use yii\grid\GridView;
use yii\widgets\Pjax;
/** @var yii\web\View $this */
/** @var common\models\GullarSearch $searchModel */
/** @var yii\data\ActiveDataProvider $dataProvider */

$this->title = 'Gullars';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="gullar-index">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Create Gullar', ['create'], ['class' => 'btn btn-success']) ?>
    </p>

    <?php Pjax::begin(); ?>
    <?php // echo $this->render('_search', ['model' => $searchModel]); ?>

    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            'id',
            'gulnomi',
            'gulnarxi',
            'kategoriya_id',
            'gulmalumoti:ntext',
            //'gulrasmi:ntext',
            [
                'class' => ActionColumn::className(),
                'urlCreator' => function ($action, Gullar $model, $key, $index, $column) {
                    return Url::toRoute([$action, 'id' => $model->id]);
                    
                 }

            ],
        ],
    ]); ?>

    <?php Pjax::end(); ?>

</div>
