import {
  observable,
  action,
  toJS,
  computed,
  extendObservable,
} from 'mobx'

import { topicSchema } from '../util/variable-define'
import { get, post } from '../util/http'
// import reply from '../views/topic-detail/reply';

const createdTopic = (topic) => {
  return Object.assign({}, topicSchema, topic)
}

// const createReply = (reply) => {
//   return Object.assign({}, replySchema, reply)
// }

class Topic {
  constructor(data) {
    extendObservable(this, data)
  }

  @observable syncing = false

  @observable createdReplies = []

  @action doReply(content) {
    return new Promise((resolve, reject) => {
      post(`/topic/${this.id}/replies`, {
        accesstoken: '4f97e444-fb57-4592-a349-775ac2d053e7',
        content,
      })
        .then((data) => {
          if (data.success) {
            this.createdReplies.push({
              create_at: Date.now(),
              id: data.reply_id,
              content,
            })
            resolve({
              replyId: data.reply_id,
              content,
            })
          }
        })
        .catch(reject)
    })
  }
}

class TopicStore {
  @observable topics

  @observable details

  @observable syncing = false

  @observable createdTopics

  @observable tab

  constructor({
    syncing = false,
    topics = [],
    tab = null,
    details = [],
  } = {}) {
    this.syncing = syncing
    this.topics = topics.map(topic => new Topic(createdTopic(topic)))
    this.details = details.map(topic => new Topic(createdTopic(topic)))
    this.tab = tab
  }

  addTopic(topic) {
    this.topics.push(new Topic(createdTopic(topic)))
  }

  @computed get detailsMap() {
    return this.details.reduce((result, detail) => {
      result[detail.id] = detail
      return result
    }, {})
  }

  @action fetchTopics(tab) {
    return new Promise((resolve, reject) => {
      if (tab === this.tab && this.topics.length > 0) {
        resolve()
      } else {
        this.tab = tab
        this.topics = []
        this.syncing = true
        get('/topics', {
          mdrender: false,
          tab,
        }).then((resp) => {
          if (resp.success) {
            const topics = resp.data.map((topic) => {
              return new Topic(createdTopic(topic))
            })
            this.topics = topics
            this.syncing = false
            resolve()
          } else {
            this.syncing = false
            reject()
          }
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }

  @action getTopicDetail(id) {
    return new Promise((resolve, reject) => {
      if (this.detailsMap[id]) {
        resolve(this.detailsMap[id])
      } else {
        get(`/topic/${id}`, {
          mdrender: false,
        }).then((resp) => {
          if (resp.success) {
            const topic = new Topic(createdTopic(resp.data), true)
            this.details.push(topic)
            resolve(topic)
          } else {
            reject()
          }
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }

  toJson() {
    return {
      page: this.page,
      topics: toJS(this.topics),
      syncing: this.syncing,
      detail: toJS(this.details),
      tab: this.tab,
    }
  }
}

export default TopicStore
