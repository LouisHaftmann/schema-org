import { hash } from 'ohash'
import type { DeepPartial } from 'utility-types'
import type { Arrayable, IdReference, SchemaNodeInput, Thing } from '../types'
import {
  callAsPartial,
  defineRootNodeResolver,
  idReference,
  prefixId,
  resolveId,
  setIfEmpty,
} from '../utils'
import type { Article } from '../defineArticle'
import { ArticleId } from '../defineArticle'
import type { AuthorInput } from '../shared/resolveAuthors'
import { resolveAuthor } from '../shared/resolveAuthors'

export interface Comment extends Thing {
  /**
   * The textual content of the comment, stripping HTML tags.
   */
  text: string
  /**
   *  A reference by ID to the parent Article (or WebPage, when no Article is present).
   */
  about?: IdReference
  /**
   * A reference by ID to the Person who wrote the comment.
   */
  author: Arrayable<AuthorInput>
}

/**
 * Describes a review. Usually in the context of an Article or a WebPage.
 */
export const defineCommentPartial = <K>(input?: DeepPartial<Comment> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  callAsPartial(defineComment, input)

/**
 * Describes a review. Usually in the context of an Article or a WebPage.
 */
export function defineComment<T extends SchemaNodeInput<Comment>>(input: T) {
  return defineRootNodeResolver<T, Comment>(input, {
    required: [
      'text',
    ],
    defaults: {
      '@type': 'Comment',
    },
    resolve(node, client) {
      // generate dynamic id if none has been set
      setIfEmpty(node, '@id', prefixId(client.canonicalUrl, `#/schema/comment/${hash(node.text)}`))
      resolveId(node, client.canonicalUrl)
      // @todo fix types
      if (node.author)
        node.author = resolveAuthor(client, node.author) as Arrayable<AuthorInput>
      return node
    },
    mergeRelations(node, { findNode }) {
      const article = findNode<Article>(ArticleId)

      if (article)
        setIfEmpty(node, 'about', idReference(article))
    },
  })
}
