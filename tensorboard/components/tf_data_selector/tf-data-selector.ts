/* Copyright 2018 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an 'AS IS' BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
namespace tf_data_selector {

Polymer({
  is: 'tf-data-selector',
  properties: {
    _allExperiments: {
      type: Array,
      value: (): Array<tf_backend.Experiment> => [],
    },

    _comparingExpsString: {
      type: String,
      value: tf_storage.getStringInitializer('e',
          {defaultValue: '', polymerProperty: '_comparingExpsString'}),
    },

    _comparingExps: {
      type: Array,
      computed: '_getComparingExps(_comparingExpsString, _allExperiments.*)',
    },
  },

  observers: [
    '_expStringObserver(_comparingExpsString)',
  ],

  attached() {
    this._updateExpKey = tf_backend.experimentsStore
        .addListener(() => this._updateExps());
    this._updateExps();
  },

  detached() {
    tf_backend.experimentsStore.removeListenerByKey(this._updateExpKey);
  },

  _updateExps() {
    this.set('_allExperiments', tf_backend.experimentsStore.getExperiments());
  },

  _getComparingExps() {
    const lookupMap = new Map(this._allExperiments.map(e => [e.id, e]));
    const ids = tf_data_selector.decodeIdArray(this._comparingExpsString);
    return ids.filter(id => lookupMap.has(id)).map(id => lookupMap.get(id));
  },

  _expStringObserver: tf_storage.getStringObserver('e',
      {defaultValue: '', polymerProperty: '_comparingExpsString'}),

  _experimentAdded(event) {
    const newExperiments = event.detail;
    const newComparingExpIds = this._comparingExps
        .concat(newExperiments).map(({id}) => id);
    this._comparingExpsString = tf_data_selector.encodeIdArray(
        newComparingExpIds);
  },

});

}  // namespace tf_data_selector
