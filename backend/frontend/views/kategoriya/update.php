<?php

use yii\helpers\Html;

/** @var yii\web\View $this */
/** @var common\models\Kategoriya $model */

$this->title = 'Update Kategoriya: ' . $model->id;
$this->params['breadcrumbs'][] = ['label' => 'Kategoriyas', 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->id, 'url' => ['view', 'id' => $model->id]];
$this->params['breadcrumbs'][] = 'Update';
?>
<div class="kategoriya-update">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
