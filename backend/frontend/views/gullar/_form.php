<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;
use yii\helpers\ArrayHelper;
use common\models\Kategoriya;

/**  @var yii\web\View $this */
/**  @var common\models\Gullar $model */
/** @var yii\widgets\ActiveForm $form */
?>

<div class="gullar-form">

    <?php $form = ActiveForm::begin(); ?>

    <?= $form->field($model, 'gulnomi')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'gulnarxi')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'kategoriya_id')->dropDownList(
        ArrayHelper::map(Kategoriya::find()->all(), 'id', 'mavzunomi'),
        ['prompt' => 'Kategoriyani tanlang...']
    ) ?>

    <?= $form->field($model, 'soni')->textInput(['type' => 'number', 'min' => 0]) ?>

    <?= $form->field($model, 'gulmalumoti')->textarea(['rows' => 6]) ?>

    <?= $form->field($model, 'gulrasmi')->textInput(['maxlength' => true]) ?>

    <div class="form-group">
        <?= Html::submitButton('Save', ['class' => 'btn btn-success']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>