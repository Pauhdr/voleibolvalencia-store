/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sozse6kj23kog4v")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "llky1qvv",
    "name": "status",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "en_revision",
        "revisado",
        "pedido_realizado",
        "preparado",
        "recogido"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sozse6kj23kog4v")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "llky1qvv",
    "name": "status",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "en espera",
        "pedido",
        "listo para recoger",
        "cancelado",
        "recogido"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
