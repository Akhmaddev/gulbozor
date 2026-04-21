<?php

namespace common\models;

use yii\base\Model;
use yii\data\ActiveDataProvider;
use common\models\Gullar;

/**
 * GullarSearch represents the model behind the search form of `common\models\Gullar`.
 */
class GullarSearch extends Gullar
{
    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['id', 'gulnarxi', 'kategoriya_id'], 'integer'],
            [['gulnomi', 'gulmalumoti', 'gulrasmi'], 'safe'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     * @param string|null $formName Form name to be used into `->load()` method.
     *
     * @return ActiveDataProvider
     */
    public function search($params, $formName = null)
    {
        $query = Gullar::find();

        // add conditions that should always apply here

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $this->load($params, $formName);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to return any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        // grid filtering conditions
        $query->andFilterWhere([
            'id' => $this->id,
            'gulnarxi' => $this->gulnarxi,
            'kategoriya_id' => $this->kategoriya_id,
        ]);

        $query->andFilterWhere(['like', 'gulnomi', $this->gulnomi])
            ->andFilterWhere(['like', 'gulmalumoti', $this->gulmalumoti])
            ->andFilterWhere(['like', 'gulrasmi', $this->gulrasmi]);

        return $dataProvider;
    }
}
