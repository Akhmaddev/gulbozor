<?php

namespace common\models;

/**
 * This is the ActiveQuery class for [[Kategoriya]].
 *
 * @see Kategoriya
 */
class KategoriyaQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        return $this->andWhere('[[status]]=1');
    }*/

    /**
     * {@inheritdoc}
     * @return Kategoriya[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * {@inheritdoc}
     * @return Kategoriya|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
