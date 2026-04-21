<?php

use yii\helpers\Html;

/** @var yii\web\View $this */
/** @var common\models\Gullar $model */

$this->title = 'Update Gullar: ' . $model->id;
$this->params['breadcrumbs'][] = ['label' => 'Gullars', 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->id, 'url' => ['view', 'id' => $model->id]];
$this->params['breadcrumbs'][] = 'Update';
?>
<div class="gullar-update">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
