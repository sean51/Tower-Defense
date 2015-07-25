#pragma strict

public class Guard extends Tower
{
	private final var MAX_SOLDIERS : int = 5;
	private var soldier_list : List.<GameObject> = new List.<GameObject>();
	private var spawn_position : int = 0;
	
	function Start () 
	{
		health = 100;
		max_health = 100;
		spawns = new Vector3[5];
		spawns[0] = Vector3(transform.position.x + 1, transform.position.y, transform.position.z);
		spawns[1] = Vector3(transform.position.x, transform.position.y, transform.position.z + 1.5);
		spawns[2] = Vector3(transform.position.x - 1.5, transform.position.y, transform.position.z);
		spawns[3] = Vector3(transform.position.x, transform.position.y, transform.position.z - 1.5);
		spawns[4] = Vector3(transform.position.x + 1.5, transform.position.y, transform.position.z);
		
		var hit : RaycastHit;
		for(var spawnLocation : Vector3 in spawns)
		{
			if(Physics.Raycast(spawnLocation, Vector3.up, hit))
			{
				if(hit.collider.gameObject.tag == "Terrain")
				{
					spawnLocation = hit.point;
				}
			}
			else if(Physics.Raycast(spawnLocation, Vector3.down, hit))
			{
				if(hit.collider.gameObject.tag == "Terrain")
				{
					spawnLocation = hit.point;
				}
			}
		}
	}

	function Update () 
	{
		super.Update();
		if(soldier_list.Count < MAX_SOLDIERS && timer >= cooldown)
		{
			summonGuard();
			timer = 0.0f;
		}
	}
	
	function summonGuard()
	{
		var new_recruit : GameObject = Instantiate (guardPrefab, spawns[spawn_position++ % MAX_SOLDIERS], guardPrefab.transform.rotation);
		new_recruit.GetComponent(NPC).linkTower(gameObject);
		new_recruit.GetComponent(NPC).setDamage(damage);
		soldier_list.Add(new_recruit);
	}
	
	function destroyTower()
	{
		for(var soldier : GameObject in soldier_list)
		{
			Destroy(soldier);
		}
		super.destroyTower();
	}
	
	function Minion_Died(dead_unit : GameObject)
	{
		soldier_list.Remove(dead_unit);
		if(soldier_list.Count == MAX_SOLDIERS)
		{
			timer = 0.0f;
		}
	}
	
	function increaseLevel()
	{
		damage *= 2;
		mend(1);
		level++;
	}
}