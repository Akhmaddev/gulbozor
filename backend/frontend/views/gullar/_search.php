<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/** @var yii\web\View $this */
/** @var common\models\GullarSearch $model */
/** @var yii\widgets\ActiveForm $form */
?>

<div class="gullar-search">

    <?php $form = ActiveForm::begin([
        'action' => ['index'],
        'method' => 'get',
        'options' => [
            'data-pjax' => 1
        ],
    ]); ?>

    <?= $form->field($model, 'id') ?>

    <?= $form->field($model, 'gulnomi') ?>

    <?= $form->field($model, 'gulnarxi') ?>

    <?= $form->field($model, 'kategoriya_id') ?>

    <?= $form->field($model, 'gulmalumoti') ?>

    <?php // echo $form->field($model, 'gulrasmi') ?>

    <div class="form-group">
        <?= Html::submitButton('Search', ['class' => 'btn btn-primary']) ?>
        <?= Html::resetButton('Reset', ['class' => 'btn btn-outline-secondary']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
