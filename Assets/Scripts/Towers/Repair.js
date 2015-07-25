#pragma strict

public class Repair extends Tower
{
	private var repairRespawn : boolean = false;
	private var currentMender : GameObject;
	
	function Start () 
	{
		health = 100;
		max_health = 100;
		repairRespawn = true;
		spawns = new Vector3[1];
		spawns[0] = transform.position + transform.forward * 1.0;
		var hit03 : RaycastHit;
		if(Physics.Raycast(spawns[0], Vector3.up, hit03))
		{
			if(hit03.collider.gameObject.tag == "Terrain")
			{
				spawns[0] = hit03.point;
			}
		}
		else if(Physics.Raycast(spawns[0], Vector3.down, hit03))
		{
			if(hit03.collider.gameObject.tag == "Terrain")
			{
				spawns[0] = hit03.point;
			}
		}
	}

	function Update () 
	{
		super.Update();
		if (repairRespawn && timer >= cooldown)
		{
			summonMender();
			timer = 0.0f;
		}
	}
	
	function destroyTower()
	{
		Destroy(currentMender);
		super.destroyTower();
	}
	
	function Minion_Died(dead_unit : GameObject)
	{
		timer = 0.0f;
		repairRespawn = true;
	}
	
	function summonMender()
	{
		var newMender : GameObject = Instantiate (menderPrefab, spawns[0], menderPrefab.transform.rotation);
		newMender.GetComponent(NPC).linkTower(gameObject);
		currentMender = newMender;
		repairRespawn = false;
	}
	
	function Find_Mender_Target() : GameObject
	{
		var chosen_object : GameObject = null;
		var chosen_component : Destructable = null;
		var chosen_enemy : GameObject = null;
		for (var hit_object : Collider in Physics.OverlapSphere(gameObject.transform.position, 30))
		{
			if (hit_object.gameObject.tag == "Tower")
			{
				if (hit_object.gameObject.GetComponent(Tower).Hurt())
				{
					if (chosen_object == null)
					{
						chosen_object = hit_object.gameObject;
						chosen_component = hit_object.gameObject.GetComponent(Tower);
					}
					else if (hit_object.gameObject.GetComponent(Tower).Get_Health() < chosen_component.Get_Health())
					{
						chosen_object = hit_object.gameObject;
						chosen_component = hit_object.gameObject.GetComponent(Tower);
					}
				}
			}
			else if (level > 1 && hit_object.gameObject.tag == "NPC")
			{
				if (hit_object.gameObject.GetComponent(NPC).Hurt())
				{
					if(chosen_object == null)
					{
						chosen_object = hit_object.gameObject;
						chosen_component = hit_object.gameObject.GetComponent(NPC);
					}
					if (hit_object.gameObject.GetComponent(NPC).Get_Health() < chosen_component.Get_Health())
					{
						chosen_object = hit_object.gameObject;
						chosen_component = hit_object.gameObject.GetComponent(NPC);
					}
				}
			}
			else if (level > 2 && hit_object.gameObject.tag == "Enemy")
			{
				chosen_enemy = hit_object.gameObject;
			}
		}
		if (chosen_enemy != null)
		{
			return chosen_enemy;
		}
		else if (chosen_object != null)
		{
			if (chosen_component.Get_Health() < chosen_component.Get_Max_Health())
			{
				return chosen_object;
			}
		}
		return null;
	}
	
	function increaseLevel()
	{
		mend(1);
		level++;
	}
}