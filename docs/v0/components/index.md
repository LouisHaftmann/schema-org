# How Schema Components Work

Each Schema has an associated component that can be used to configure your sites
Schema in your vue files `<template>`. Behind the scenes, these components are simply calling the associated
`define${Schema}` function while providing a less boilerplate heavy approach to defining schemas.

Each component implements the same logic and there are multiple ways to define your components.

## Headless - Attributes

Any attribute passed on the component will be forwarded to the
Schema.

For fields which are prefixed with `@`, such as `@type` and `@id`, you can simply omit the `@`.

For example, to set a page name and type:

```vue
<template>
<!-- About us page inline -->
<SchemaOrgWebPage type="AboutPage" name="About Us" />
</template>
```

## Headless - Slots

Alternatively to providing attributes on the prop, you are also able to provide the data through slots which
use the same name as the attribute.

- Only supports shallow text nodes

For example, we can generate a FAQ Question with the following:

```vue
<template>
<SchemaOrgQuestion>
  <template #name>
    What is the capital of Australia?
  </template>
  <template #acceptedAnswer>
    Canberra
  </template>
</SchemaOrgQuestion>
</template>
```


## Rendered Default slot

If you want to render the markup and want full customisation, you can provide a default slot. The slot props
will be the resolved node.

```vue
<template>
<SchemaOrgQuestion>
  <!-- Scoped slots won't render anything -->
  <template #name>
    {{ question }}
  </template>
  <template #acceptedAnswer>
   <div v-html="answer" />
  </template>
  <!-- Default slot will render -->
  <template>
  <h2>
    {{ question }}
  </h2>
  <div v-html="answer" />
  </template>
</SchemaOrgQuestion>
</template>
```
