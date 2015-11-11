class CreateRecords < ActiveRecord::Migration
  def change
    create_table :records do |t|
      t.text :title
      t.date :date
      t.float :amount

      t.timestamps null: false
    end
  end
end
