<?php
use yii\helpers\Html;
use yii\widgets\DetailView;

$this->title = $model->gulnomi;
?>
<div class="gullar-view">
    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Update', ['update', 'id' => $model->id], ['class' => 'btn btn-primary']) ?>
        <?= Html::a('Delete', ['delete', 'id' => $model->id], [
            'class' => 'btn btn-danger',
            'data' => [
                'confirm' => 'Ochirishga ishonchingiz komilmi?',
                'method' => 'post',
            ],
        ]) ?>
    </p>

    <?= DetailView::widget([
        'model' => $model,
        'attributes' => [
            'id',
            'gulnomi',
            'gulnarxi',
            [
                'attribute' => 'kategoriya_id',
                'label' => 'Kategoriya',
                'value' => function($model) {
                    return $model->kategoriya ? $model->kategoriya->mavzunomi : 'Yoq';
                }
            ],
            'gulmalumoti:ntext',
            'gulrasmi', // Bu yerda rasm nomi matn bo'lib chiqadi
        ],
    ]) ?>
</div>