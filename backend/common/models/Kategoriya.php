<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "kategoriya".
 *
 * @property int $id
 * @property string $mavzunomi
 */
class Kategoriya extends \yii\db\ActiveRecord
{


    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'kategoriya';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['mavzunomi'], 'required'],
            [['mavzunomi'], 'string', 'max' => 120],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'mavzunomi' => 'Mavzunomi',
        ];
    }

    /**
     * {@inheritdoc}
     * @return KategoriyaQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new KategoriyaQuery(get_called_class());
    }

}
